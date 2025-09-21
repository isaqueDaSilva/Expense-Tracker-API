import { database } from "../../../../app";

export async function disableToken(token: string): Promise<void> {
    const newToken = `
        INSERT INTO disabled_tokens (raw_token_value)
        VALUES ($1);
    `;
    const values = [token];
    await database.query(newToken, values);
};