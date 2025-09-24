import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export function databaseConfig(databaseURL: string | undefined): NeonQueryFunction<false, false> {
    if (typeof databaseURL === 'string') {
        return neon(databaseURL);
    } else {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }
};