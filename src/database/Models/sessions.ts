export const sessionsTableSchema = `
    CREATE TABLE IF NOT EXISTS sessions(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        at_verification_code TEXT UNIQUE NOT NULL,
        refresh_token_id TEXT UNIQUE NOT NULL
        refresh_token TEXT UNIQUE NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE NOT NULL,
        updated_at DATE DEFAULT CURRENT_DATE NOT NULL
    );
`;
