export const disabledTokensTableSchema = `
    CREATE TABLE IF NOT EXISTS disabled_tokens(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        raw_token_value TEXT UNIQUE NOT NULL,
        disabled_at DATE NOT NULL DEFAULT CURRENT_DATE
    );
`;