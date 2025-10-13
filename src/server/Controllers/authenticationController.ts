import type { IncomingMessage, ServerResponse } from "http";
import { decodeJSONBody } from "./services/jsonDecoder.js";
import { decodeCreateUserDTO } from "./services/user/decodeUser.js";
import { hashPassword, comparePassword } from "./services/passwordHash.js";
import { createUser, getUserByEmail, updateUserLoginStatus, deleteUser } from "./services/user/userCRUD.js";
import { createJWT, getJWTValue, RefreshToken } from "./services/jwtService.js";
import { basicAuthenticationHandler } from "./services/basicAuthenticantionHandler.js";
import { disableToken } from "./services/tokens/tokenCRUD.js";
import { setResponse } from "./services/setResponse.js";
import { verifyToken } from "./services/verifyToken.js";
import { database } from "../../app.js";
import { getAccessToken } from "./services/getAccessToken.js";

// MARK: Refresh Token Cook
function setRefreshTokenCookie(token: RefreshToken, response: ServerResponse) {
    const cookie = `refresh_token=${token.token}; HttpOnly; Secure; SameSite=Strict; Path=/token/refresh; Expires=${token.expiresOn}`;
    response.setHeader("Set-Cookie", cookie);
}

function getRefreshToken(request: IncomingMessage): string | undefined {
    const cookieValue = request.headers.cookie || ""
    return cookieValue.split("; ").map(c => c.trim().split("=")).find(([name]) => name === "refresh_token")?.[1];
}

function clearCookie(response: ServerResponse) {
  const cookie = `refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/token/refresh; Max-Age=0`;
  response.setHeader("Set-Cookie", cookie);
}

async function getPairOfTokens(request: IncomingMessage): Promise<{accessToken: string, refreshToken: string, userID: string}> {
    const { accessToken, userID } = await getAccessToken(request);
    const refreshTokenValue = getRefreshToken(request) || ""
    await verifyToken(refreshTokenValue, process.env.JWT_REFRESH_SECRET);

    return { accessToken: accessToken, refreshToken: refreshTokenValue, userID: userID }
}

// MARK: Auth Controller
export async function signup(request: IncomingMessage, response: ServerResponse) {
    try {
        const newUser = await decodeJSONBody(request, decodeCreateUserDTO);
        const hashedPassword = await hashPassword(newUser.password);
        newUser.password = ""; // Clear the plain password from memory as soon as possible

        const createdUser = await createUser(newUser.email, newUser.username, hashedPassword);

        const pairOfTokens = createJWT(createdUser.id);

        const responseJSON = {
            accessToken: pairOfTokens.accessToken,
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

            await updateUserLoginStatus(user.id, true);

            const responseJSON = {
                accessToken: newPairOfToken.accessToken,
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
            disableToken(tokens.accessToken),
            disableToken(tokens.refreshToken)
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
        
        database.transaction([
            disableToken(tokens.accessToken),
            disableToken(tokens.refreshToken)
        ])

        const newPairOfToken = createJWT(tokens.userID);

        setRefreshTokenCookie(newPairOfToken.refreshToken, response);
        setResponse(response, 200, { accessToken: newPairOfToken.accessToken });
    } catch (error) {
        console.error("Error to refresh token:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};

export async function verifyAccessToken(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = getJWTValue(request);
        await verifyToken(token, process.env.JWT_ACCESS_SECRET);

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
            disableToken(tokens.accessToken),
            disableToken(tokens.refreshToken)
        ]);

        setResponse(response, 204, {message: "User deleted successfully"} );
    } catch (error) {
        console.error("Error processing user deletion:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};