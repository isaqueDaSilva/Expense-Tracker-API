import jwt from "jsonwebtoken";
import type { IncomingMessage } from "http";
import { TokenType } from "./tokens/tokenType.js";
import { JWTPayload } from "./tokens/jwtPayload.js";

export function createJWT(userID: string): {accessToken: string, refreshToken: string } {
    const issuedAt: Date = new Date();
    const randomNumber = Math.floor(Math.random() * 1000000).toString();
    const issuer = process.env.JWT_ISSUER || "Expense Tracker API";

    const accessTokenPayload: JWTPayload = {
        id: userID + randomNumber + issuedAt.getTime().toString(),
        issuer: issuer,
        subject: userID,
        issuedAt: issuedAt.toString(),
        expiration: new Date(issuedAt.getTime() + 60 * 60 * 1000).toString() // 1 hour
    }

    const refreshTokenPayload: JWTPayload = {
        id: userID + randomNumber + issuedAt.getTime().toString(),
        issuer: issuer,
        subject: userID,
        issuedAt: issuedAt.toString(),
        expiration: new Date(issuedAt.getTime() + 60 * 60 * 1000 * 24 * 7).toString() // 7 days
    }

    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    if (typeof accessTokenSecret === "string" && refreshTokenSecret === "string") {
        const accessToken = jwt.sign(accessTokenPayload, accessTokenSecret);
        const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret);

        return { accessToken, refreshToken }
    } else {
        throw new Error("Internal server error.");
    }
};

export function verifyJWT(token: string, tokenType: TokenType): string {
    let secret: string | undefined;
    let issuer = process.env.JWT_ISSUER

    switch (tokenType) {
        case TokenType.access: 
            secret = process.env.JWT_SECRET;
            break;
        case TokenType.refresh:
            secret = process.env.JWT_REFRESH_SECRET;
            break
    }

    if (typeof secret === "string" && typeof issuer === "string") {
        try {
            const decoded = jwt.verify(token, secret) as JWTPayload;

            if (!(decoded.issuer === issuer)) {
                throw new Error("Issuer not matches as the issuer value of this API.")
            }

            return decoded.subject;
        } catch (error) {
            throw new Error("Invalid token");
        }
    } else {
        throw new Error("Internal server error.");
    }
};

export function getJWTValue(request: IncomingMessage, tokenType: TokenType): string {
    let authHeader: string | undefined;

    switch (tokenType) {
        case TokenType.access:
            authHeader = request.headers['authorization'];
            break
        case TokenType.refresh:
            authHeader = request.headers['refreshtoken'] as string | undefined;
            break
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new Error("Invalid Authorization header format");
    }

    return token;
};