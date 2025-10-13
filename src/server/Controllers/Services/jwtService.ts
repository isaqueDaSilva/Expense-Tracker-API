import jwt from "jsonwebtoken";
import type { IncomingMessage } from "http";
import { JWTPayload } from "./tokens/jwtPayload.js";

export type RefreshToken = { token: string, expiresOn: string }

export function createJWT(userID: string): {accessToken: string, refreshToken: RefreshToken } {
    const issuedAt: Date = new Date();
    const refreshTokenExpirationDate = new Date(issuedAt.getTime() + 60 * 60 * 1_000 * 24) // 1 Day
    const randomNumber = Math.floor(Math.random() * 1000000).toString();
    const issuer = process.env.JWT_ISSUER || "Expense Tracker API";

    const accessTokenPayload: JWTPayload = {
        id: userID + randomNumber + issuedAt.getTime().toString(),
        issuer: issuer,
        subject: userID,
        issuedAt: issuedAt.toString(),
        expiration: new Date(issuedAt.getTime() + 60 * 60 * 250).toString() // 15 minutes
    }

    const refreshTokenPayload: JWTPayload = {
        id: userID + randomNumber + issuedAt.getTime().toString(),
        issuer: issuer,
        subject: userID,
        issuedAt: issuedAt.toString(),
        expiration: refreshTokenExpirationDate.toString()
    }

    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    let accessToken: string;
    let refreshToken: string;

    if (typeof accessTokenSecret === 'string') {
        accessToken = jwt.sign(accessTokenPayload, accessTokenSecret);
    } else {
        throw new Error("Failed to create access token.");
    }

    if (typeof refreshTokenSecret === 'string') {
        refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret);
    } else {
        throw new Error("Failed to create refresh token.");
    }

    return { accessToken: accessToken, refreshToken: { token: refreshToken, expiresOn: refreshTokenExpirationDate.toISOString() } }
};

export function verifyJWT(token: string, secret: string | undefined): { userID: string, error?: Error} {
    const issuer = process.env.JWT_ISSUER

    if (!(typeof secret === 'string')) {
        throw new Error("JWT Secret is not available.")
    }

    if (!(typeof issuer === 'string')) {
        throw new Error("JWT issuer is not available.")
    }

    try {
        const decoded = jwt.verify(token, secret) as JWTPayload;
        const currentDate = new Date()
        const expirationDate = new Date(decoded.expiration);
        const issuedAt = new Date(decoded.issuedAt);

        if (!(decoded.issuer == issuer)) {
            return { userID: decoded.subject, error: new Error("Issuer not matches as the issuer value of this API.") };
        }

        if ((issuedAt == expirationDate) || (expirationDate <= currentDate)) {
            return { userID: decoded.subject, error: new Error("Invalid token with time outside of the range.") };
        }

        return { userID: decoded.subject };
    } catch (error) {
        throw error;
    }
};

export function getJWTValue(request: IncomingMessage): string {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new Error("Invalid Authorization header format");
    }

    return token;
};