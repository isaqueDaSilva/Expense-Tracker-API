export const sessionsTableSchema = `
    CREATE TABLE IF NOT EXISTS sessions(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        at_verification_code TEXT UNIQUE NOT NULL,
        refresh_token_id TEXT UNIQUE NOT NULL,
        refresh_token TEXT UNIQUE NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`;

export const updateLastLoggedDateOnUserTableFuncition = `
    CREATE OR REPLACE FUNCTION update_last_logged_date()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE users
        SET last_logged_date = CURRENT_TIMESTAMP
        WHERE id = NEW.user_id;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
`;

export const createUpdateLastLoggedDateOnUserTableTrigger = `
    CREATE TRIGGER trigger_update_last_logged_date
    AFTER INSERT ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_last_logged_date();
`
