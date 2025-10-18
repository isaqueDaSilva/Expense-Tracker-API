import { IncomingMessage } from "http";
import { getJWTValue } from "./jwtService.js";
import { isRefreshTokenValid, verifyAccessToken } from "./verifyToken.js";
import { getRefreshToken } from "./sessionCRUD.js";

export async function getAccessTokenValue(request: IncomingMessage): Promise<{accessToken: string, userID: string}> {
    const accessTokenValue = getJWTValue(request);
    const userID = await verifyAccessToken(accessTokenValue, process.env.JWT_ACCESS_SECRET);

    return { accessToken: accessTokenValue, userID: userID };
};

export async function verifyRefreshTokenValidity(refreshTokenID: string) {
    const refreshTokenValue = await getRefreshToken(refreshTokenID);
    
    try {
        await isRefreshTokenValid(refreshTokenID, refreshTokenValue, process.env.JWT_REFRESH_SECRET);
        return refreshTokenValue;
    } catch (error) {
        throw error;
    }
}