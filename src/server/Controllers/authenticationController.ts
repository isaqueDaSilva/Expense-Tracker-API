import type { IncomingMessage, ServerResponse } from "http";
import { decodeJSONBody } from "./services/jsonDecoder.js";
import { decodeCreateUserDTO } from "./services/user/decodeUser.js";
import { hashPassword, comparePassword } from "./services/passwordHash.js";
import { createUser, getUserByEmail, updateUserLoginStatus, deleteUser } from "./services/user/userCRUD.js";
import { createJWT } from "./services/jwtService.js";
import { basicAuthenticationHandler } from "./services/basicAuthenticantionHandler.js";
import { disableToken } from "./services/tokens/tokenCRUD.js";
import { setResponse } from "./services/setResponse.js";
import { verifyToken } from "./services/verifyToken.js";

export async function signup(request: IncomingMessage, response: ServerResponse) {
    try {
        const newUser = await decodeJSONBody(request, decodeCreateUserDTO);
        const hashedPassword = await hashPassword(newUser.password);
        newUser.password = ""; // Clear the plain password from memory as soon as possible

        const createdUser = await createUser(newUser.email, newUser.username, hashedPassword);

        const token = createJWT(createdUser.id);

        const responseJSON = {
            token: token,
            user: createdUser
        };

        setResponse(response, 201, "result", responseJSON);
    } catch (error) {
        console.error("Error processing signup:", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};

export async function signin(request: IncomingMessage, response: ServerResponse) {
    try {
        const credentials = basicAuthenticationHandler(request);
        console.log("Credentials received:", credentials.username);

        const user = await getUserByEmail(credentials.username);
        const isPasswordValid = await comparePassword(credentials.password, user.passwordHash);

        user.passwordHash = ""; // Clear the password hash from memory as soon as possible

        if (!user.userResponse.isLogged && isPasswordValid) {
            const newToken = createJWT(user.userResponse.id);

            await updateUserLoginStatus(user.userResponse.id, true);

            const responseJSON = {
                token: newToken,
                user: user.userResponse
            };

            setResponse(response, 200, "result", responseJSON);
            return;
        } else {
            setResponse(response, 401, "Error", "Authentication failed.");
        }

    } catch (error) {
        console.error("Error processing signin:", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};

export async function signout(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request);
        await updateUserLoginStatus(token.userID, false);
        await disableToken(token.value); // Store the token in the disabled tokens list
        setResponse(response, 204, "message", "User signed out successfully" );
    } catch (error) {
        console.error("Error processing signout:", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};

export async function removeUser(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request);
        await deleteUser(token.userID);
        await disableToken(token.value); // Store the token in the disabled tokens list
        setResponse(response, 204, "message", "User deleted successfully" );
    } catch (error) {
        console.error("Error processing user deletion:", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};