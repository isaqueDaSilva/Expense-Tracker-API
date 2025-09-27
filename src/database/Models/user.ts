export const usersTableSchema = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@%_%.%_%'),
        password_hash TEXT UNIQUE NOT NULL,
        is_logged BOOLEAN NOT NULL DEFAULT true,
        last_logged_date DATE DEFAULT CURRENT_DATE NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE NOT NULL
    );
`;