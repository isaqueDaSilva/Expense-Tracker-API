import { database } from "../../../../app.js";

export async function disableToken(token: string) {
    const newToken = `
        INSERT INTO disabled_tokens (raw_token_value)
        VALUES ($1);
    `;

    const values = [token];
    await database.query(newToken, values);
};

export async function isTokenValid(rawToken: string): Promise<boolean> {
    const getToken = `
        SELECT COUNT(raw_token_value) FROM disabled_tokens
        WHERE raw_token_value = $1
    `;

    const values = [rawToken];
    const result = await database.query(getToken, values);

    if (result.length == 0) {
        return true
    } else {
        return false
    }
};