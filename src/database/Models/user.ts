export const usersTableSchema = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@%_%.%_%'),
        password_hash TEXT UNIQUE NOT NULL,
        last_logged_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE NOT NULL
    );
`;