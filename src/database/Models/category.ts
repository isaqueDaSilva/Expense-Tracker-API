export const categoryTableSchema = `
    CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        title VARCHAR(30) NOT NULL,
        created_by UUID DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at DATE DEFAULT CURRENT_DATE NOT NULL
    );
`;

// MARK: DEFAULT CATEGORIES

export const groceries = `
    INSERT INTO categories (title) VALUES ('Groceries');
`;

export const leisure = `
    INSERT INTO categories (title) VALUES ('Leisure');
`;

export const electronics = `
    INSERT INTO categories (title) VALUES ('Electronics');
`;

export const utilities = `
    INSERT INTO categories (title) VALUES ('Utilities');
`;

export const clothing = `
    INSERT INTO categories (title) VALUES ('Clothing');
`;

export const health = `
    INSERT INTO categories (title) VALUES ('Health');
`;