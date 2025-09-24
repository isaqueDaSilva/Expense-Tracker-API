export const categoryTableSchema = `
    CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        title VARCHAR(30) NOT NULL,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL DEFAULT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    );
`;

// MARK: DEFAULT CATEGORIES

export const groceries = `
    INSERT INTO categories (title) VALUES ('Groceries') ON CONFLICT (title) DO NOTHING;
`;

export const leisure = `
    INSERT INTO categories (title) VALUES ('Leisure') ON CONFLICT (title) DO NOTHING;
`;

export const electronics = `
    INSERT INTO categories (title) VALUES ('Electronics') ON CONFLICT (title) DO NOTHING;
`;

export const utilities = `
    INSERT INTO categories (title) VALUES ('Utilities') ON CONFLICT (title) DO NOTHING;
`;

export const clothing = `
    INSERT INTO categories (title) VALUES ('Clothing') ON CONFLICT (title) DO NOTHING;
`;

export const health = `
    INSERT INTO categories (title) VALUES ('Health') ON CONFLICT (title) DO NOTHING;
`;