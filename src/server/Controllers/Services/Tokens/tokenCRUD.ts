import { NeonQueryPromise } from "@neondatabase/serverless";
import { database } from "../../../../app.js";

export function disableToken(token: string): NeonQueryPromise<false, false, Record<string, any>[]> {
    const newToken = `
        INSERT INTO disabled_tokens (raw_token_value)
        VALUES ($1)
        ON CONFLICT (raw_token_value) DO NOTHING;
    `;

    const values = [token];
    return database.query(newToken, values);
};

export async function isTokenValid(rawToken: string): Promise<boolean> {
    const getToken = `
        SELECT COUNT(raw_token_value) FROM disabled_tokens
        WHERE raw_token_value = $1;
    `;

    const values = [rawToken];
    const result = await database.query(getToken, values);

    if (result.length == 1) {
        const tokenCount = result[0] as { count: string }

        if (tokenCount.count == '0') {
            return true
        } else {
            return false
        }
    } else {
        throw new Error("Cannot possible to check if the token is valid.")
    }
};