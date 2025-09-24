import jwt from "jsonwebtoken";
import type { IncomingMessage } from "http";

export function createJWT(userID: string): string {
    const issuedAt: Date = new Date();
    const randomNumber = Math.floor(Math.random() * 1000000).toString();
    const issuer = process.env.JWT_ISSUER || "Expense Tracker API";

    const payload = {
        id: userID + randomNumber + issuedAt.getTime().toString(),
        issuer: issuer,
        subject: userID,
        issuedAt: issuedAt.toString(),
        expiration: new Date(issuedAt.getTime() + 60 * 60 * 1000).toString() // 1 hour
    }

    const secret = process.env.JWT_SECRET;

    if (typeof secret === "string") {
        return jwt.sign(payload, secret);
    } else {
        throw new Error("Internal server error.");
    }
}

export function verifyJWT(token: string): string {
    const secret = process.env.JWT_SECRET;

    if (typeof secret === "string") {
        try {
            const decoded = jwt.verify(token, secret) as { subject: string };
            return decoded.subject;
        } catch (error) {
            throw new Error("Invalid token");
        }
    } else {
        throw new Error("Internal server error.");
    }
}

export function jwtAuthenticationHandler(request: IncomingMessage) {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new Error("Invalid Authorization header format");
    }

    return token;
}