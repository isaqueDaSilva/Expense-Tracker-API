import { IncomingMessage } from "http";
import { getJWTValue } from "./jwtService.js";
import { verifyToken } from "./verifyToken.js";

export async function getAccessToken(request: IncomingMessage): Promise<{accessToken: string, userID: string}> {
    const accessTokenValue = getJWTValue(request)
    const userID = await verifyToken(accessTokenValue, process.env.JWT_ACCESS_SECRET);

    return { accessToken: accessTokenValue, userID: userID }
}