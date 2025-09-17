export const usersTableSchema = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@%_%.%_%'),
        password_hash TEXT UNIQUE NOT NULL,
        is_logged BOOLEAN NOT NULL DEFAULT true
        last_logged_date DATE NOT NULL DEFAULT CURRENT_DATE
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    );
`;