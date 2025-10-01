import type { IncomingMessage } from "http";
import { getJWTValue, verifyJWT } from "./jwtService.js";
import { disableToken, isTokenValid } from "./tokens/tokenCRUD.js";
import { TokenType } from "./tokens/tokenType.js";
import { updateUserLoginStatus } from "./user/userCRUD.js";

export async function verifyToken(request: IncomingMessage, tokenType: TokenType): Promise<{value: string, userID: string}> {
    const token = getJWTValue(request, tokenType);
    try {
        const userID = verifyJWT(token, tokenType);

        if (await isTokenValid(token)) {
            return {value: token, userID: userID};
        } else {
            await disableToken(token)
            await updateUserLoginStatus(userID, false)
            throw new Error("Invalid token.")
        }
    } catch {
        await disableToken(token)
        throw new Error("Invalid token.")
    }
};