import type { IncomingMessage, ServerResponse } from "http";
import { decodeJSONBody } from "../services/jsonDecoder.js";
import { decodeCreateUserDTO } from "../services/user/decodeUser.js";
import { hashPassword, comparePassword } from "../services/passwordHash.js";
import { createUser, getUserByEmail, updateUserLoginStatus, deleteUser } from "../services/user/userCRUD.js";
import { createJWT, getJWTValue, RefreshToken } from "../services/tokens/jwtService.js";
import { basicAuthenticationHandler } from "../services/basicAuthenticantionHandler.js";
import { createSession, deleteSession, updateSession } from "../services/tokens/sessionCRUD.js";
import { setResponse } from "../services/setResponse.js";
import { database } from "../app.js";
import { getAccessTokenValue, verifyRefreshTokenValidity } from "../services/tokens/getTokens.js";
import { verifyAccessToken } from "../services/tokens/verifyToken.js";

// MARK: Refresh Token Cookie
function setRefreshTokenCookie(token: RefreshToken, response: ServerResponse) {
    const cookie = `refresh_token_id=${token.id}; HttpOnly; Secure; SameSite=Strict; Path=/token/refresh; Expires=${token.expiresOn}`;
    response.setHeader("Set-Cookie", cookie);
};

function getRefreshTokenID(request: IncomingMessage): string | undefined {
    const cookieValue = request.headers.cookie || "";
    return cookieValue.split("; ").map(c => c.trim().split("=")).find(([name]) => name === "refresh_token_id")?.[1];
}

function clearCookie(response: ServerResponse) {
  const cookie = `refresh_token_id=; HttpOnly; Secure; SameSite=Strict; Path=/token/refresh; Expires=`;
  response.setHeader("Set-Cookie", cookie);
}

async function getPairOfTokens(request: IncomingMessage): Promise<{accessToken: string, refreshTokenID: string, userID: string}> {
    const { accessToken, userID } = await getAccessTokenValue(request);
    const refreshTokenID = getRefreshTokenID(request) || "";
    await verifyRefreshTokenValidity(refreshTokenID)

    return { accessToken: accessToken, refreshTokenID: refreshTokenID, userID: userID }
}

// MARK: Auth Controller
export async function signup(request: IncomingMessage, response: ServerResponse) {
    try {
        const newUser = await decodeJSONBody(request, decodeCreateUserDTO);
        const hashedPassword = await hashPassword(newUser.password);
        newUser.password = ""; // Clear the plain password from memory as soon as possible

        const createdUser = await createUser(newUser.email, newUser.username, hashedPassword);

        const pairOfTokens = createJWT(createdUser.id);

        await createSession(createdUser.id, pairOfTokens.accessToken.verificationCode, pairOfTokens.refreshToken.token, pairOfTokens.refreshToken.id);

        const responseJSON = {
            accessToken: pairOfTokens.accessToken.token,
            user: createdUser
        };

        setRefreshTokenCookie(pairOfTokens.refreshToken, response)

        setResponse(response, 201, responseJSON);
    } catch (error) {
        console.error("Error processing signup:", error);
        setResponse(response, 500, { error: "Internal Server Error." });
    }
};

export async function signin(request: IncomingMessage, response: ServerResponse) {
    try {
        const credentials = basicAuthenticationHandler(request);
        const user = await getUserByEmail(credentials.username);
        const isPasswordValid = await comparePassword(credentials.password, user.passwordhash);

        user.passwordhash = ""; // Clear the password hash from memory as soon as possible

        if (!user.isLogged && isPasswordValid) {
            const newPairOfToken = createJWT(user.id);

            database.transaction([
                createSession(user.id, newPairOfToken.accessToken.verificationCode, newPairOfToken.refreshToken.token, newPairOfToken.refreshToken.id),
                updateUserLoginStatus(user.id, true)
            ])

            const responseJSON = {
                accessToken: newPairOfToken.accessToken.token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                }
            };

            setRefreshTokenCookie(newPairOfToken.refreshToken, response)
            setResponse(response, 200, responseJSON);

            return;
        } else {
            setResponse(response, 401, { error: "Authentication failed."});
        }

    } catch (error) {
        console.error("Error processing signin:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};

export async function signout(request: IncomingMessage, response: ServerResponse) {
    try {
        const tokens = await getPairOfTokens(request)

        await database.transaction([
            updateUserLoginStatus(tokens.userID, false),
            deleteSession(tokens.refreshTokenID)
        ]);

        clearCookie(response)
        setResponse(response, 204, {message: "User signed out successfully"} );
    } catch (error) {
        console.error("Error processing signout:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};

export async function refreshToken(request: IncomingMessage, response: ServerResponse) {
    try {
        const tokens = await getPairOfTokens(request);
        const newPairOfToken = createJWT(tokens.userID);

        await updateSession(tokens.refreshTokenID, newPairOfToken.refreshToken.id, newPairOfToken.refreshToken.token, newPairOfToken.accessToken.verificationCode)

        setRefreshTokenCookie(newPairOfToken.refreshToken, response);
        setResponse(response, 200, { accessToken: newPairOfToken.accessToken.token });
    } catch (error) {
        console.error("Error to refresh token:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};

export async function verifyAccessTokenFromRequest(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = getJWTValue(request);
        await verifyAccessToken(token, process.env.JWT_ACCESS_SECRET);

        setResponse(response, 200, {message: "token valid."});
    } catch (error) {
        console.error("Error to verify token:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};

export async function removeUser(request: IncomingMessage, response: ServerResponse) {
    try {
        const tokens = await getPairOfTokens(request);

        await database.transaction([
            deleteUser(tokens.userID),
            deleteSession(tokens.refreshTokenID)
        ]);

        setResponse(response, 204, {message: "User deleted successfully"} );
    } catch (error) {
        console.error("Error processing user deletion:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};