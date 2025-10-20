import type { IncomingMessage } from "http";

export function basicAuthenticationHandler(request: IncomingMessage): { username: string; password: string } {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        throw new Error("Missing or invalid Authorization header");
    }

    const base64Credentials = authHeader.split(' ')[1];

    if (typeof base64Credentials === 'string') {
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');
        console.log(username, password)
        if (!username || !password) {
            throw new Error("Invalid Authorization header format");
        }

        return { username, password };
    } else {
        throw new Error("Invalid Authorization header format");
    }
}