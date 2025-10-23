export const expensesTableSchema = `
    CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        title VARCHAR(100) NOT NULL CHECK (char_length(title) <= 100),
        description TEXT CHECK (char_length(description) <= 500),
        value NUMERIC(10, 2) NOT NULL CHECK(value >= 0.1),
        date DATE,
        category UUID REFERENCES categories(id) ON DELETE SET NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE NOT NULL,
        updated_at DATE DEFAULT CURRENT_DATE NOT NULL
    );  
`;
