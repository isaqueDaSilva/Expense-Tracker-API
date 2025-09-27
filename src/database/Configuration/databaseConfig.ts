import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export function databaseConfig(): NeonQueryFunction<false, false> {
    const databaseURL = process.env.DATABASE_URL;
    if (typeof databaseURL === 'string') {
        return neon(databaseURL);
    } else {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }
};