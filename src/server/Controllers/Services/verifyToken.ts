import { verifyJWT } from "./jwtService.js";
import { disableToken, isTokenValid } from "./tokens/tokenCRUD.js";
import { updateUserLoginStatus } from "./user/userCRUD.js";

export async function verifyToken(token: string, secret: string | undefined): Promise<string> {
    try {
        const { userID, error } = verifyJWT(token, secret);

        if (await isTokenValid(token) && !error) {
            return userID
        } else {
            await updateUserLoginStatus(userID, false)
            throw new Error("Invalid token:", error)
        }
    } catch (error) {
        if (await isTokenValid(token)) {
            await disableToken(token)
        }
        throw error;
    }
};