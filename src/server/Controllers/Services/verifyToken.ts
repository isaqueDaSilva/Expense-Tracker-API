import type { IncomingMessage } from "http";
import { jwtAuthenticationHandler, verifyJWT } from "./jwtService.js";
import { disableToken, isTokenValid } from "./tokens/tokenCRUD.js";

export async function verifyToken(request: IncomingMessage): Promise<{value: string, userID: string}> {
    const token = jwtAuthenticationHandler(request);
    try {
        const userID = verifyJWT(token);

        if (await isTokenValid(token)) {
            return {value: token, userID: userID};
        } else {
            await disableToken(token)
            throw new Error("Invalid token.")
        }
    } catch {
        await disableToken(token)
        throw new Error("Invalid token.")
    }
};