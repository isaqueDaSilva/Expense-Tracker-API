import { database } from "../../app.js";
import type { CreateExpenseDTO, ReadExpenseDTO, UpdateExpenseDTO } from "../../dtos/expenseDTO.js";

export async function createNewExpense(createExpenseDTO: CreateExpenseDTO, userID: string): Promise<ReadExpenseDTO> {
    const fields = [];
    const values = [];
    const indices = [];
    let index = 1;

    for (const [key, value] of Object.entries(createExpenseDTO)) {
        fields.push(key); // Insert field name;
        values.push(value); // Insert field value;
        indices.push(`$${index}`); // Insert placeholder;
        index++; // Increment index for the next placeholder;
    }

    values.push(userID); // Add userID for the user_id field 
    fields.push('user_id'); // Add user_id field;
    indices.push(`$${index}`); // Add placeholder for user_id;

    const newExpense = `
        INSERT INTO expenses (${fields.join(', ')})
        VALUES (${indices.join(', ')})
        RETURNING id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt";
    `;
    
    const result = await database.query(newExpense, values);

    if (result.length == 1) {
        const expense = result[0];

        if (typeof expense === "object") {
            return expense as ReadExpenseDTO;
        } else {
            throw new Error("Failed to create new expense");
        }
    } else {
        throw new Error("No expense was created.");
    }
};

export async function getAllExpenses(userID: string, currentPage: number): Promise<ReadExpenseDTO[]> {
    if (currentPage >= 1) {
        const expensesPerPage = 10;
        const offset = (currentPage - 1) * expensesPerPage;

        const getExpenses = `
            SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM expenses
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
        `;

        const values = [userID, expensesPerPage, offset];
        const result = await database.query(getExpenses, values);
        return result.map(row => row as ReadExpenseDTO);
    } else {
        throw new Error("Invalid page number. Page number must be 1 or greater.");
    }
};

export async function getAllExpensesByCategory(userID: string, categoryID: string, currentPage: number): Promise<ReadExpenseDTO[]> {
    if (currentPage >= 1) {
        const expensesPerPage = 10;
        const offset = (currentPage - 1) * expensesPerPage;

        const getExpenses = `
            SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM expenses
            WHERE user_id = $1 AND category = $2
            ORDER BY created_at DESC
            LIMIT $3 OFFSET $4;
        `;

        const values = [userID, categoryID, expensesPerPage, offset];
        const result = await database.query(getExpenses, values);
        return result.map(row => row as ReadExpenseDTO);
    } else {
        throw new Error("Invalid page number. Page number must be 1 or greater.");
    }
};

export async function getExpensesByDate(userID: string, initialDate: string, finalDate: string, currentPage: number): Promise<ReadExpenseDTO[]> {
    const initialDateValue = new Date(initialDate);
    const finalDateValue = new Date(finalDate)
    if (currentPage >= 1 && finalDateValue > initialDateValue) {
        const expensesPerPage = 10;
        const offset = (currentPage - 1) * expensesPerPage;

        const getExpenses = `
            SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM expenses
            WHERE user_id = $1 AND date BETWEEN $2 AND $3
            ORDER BY created_at DESC
            LIMIT $4 OFFSET $5
        `;

        const values = [userID, initialDate, finalDate, expensesPerPage, offset];
        const result = await database.query(getExpenses, values);
    return result.map(row => row as ReadExpenseDTO);
    } else {
        throw new Error(`Invalid page number or date range: page: ${currentPage}; initial date: ${initialDate}; final date: ${finalDate}`);
    }
};

export async function getExpenseByID(expenseID: string, userID: string): Promise<ReadExpenseDTO> {
    const getExpense = `
        SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
        FROM expenses
        WHERE id = $1 AND user_id = $2;
    `;

    const values = [expenseID, userID];
    const result = await database.query(getExpense, values);

    if (result.length == 1) {
        const expense = result[0];

        if (typeof expense === "object") {
            return expense as ReadExpenseDTO;
        } else {
            throw new Error("expense not found");
        }
    } else {
        throw new Error("No expense was founded.");
    }
};

export async function updateExpense(updatedExpense: UpdateExpenseDTO, expenseID: string, userID: string): Promise<ReadExpenseDTO> {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updatedExpense)) {
        fields.push(`${key} = $${index}`); // Insert field name and placeholder
        values.push(value); // Insert field value
        index++; // Increment index for the next placeholder
    }

    values.push(expenseID, userID); // Add expenseID and userID for the WHERE clause

    const updateExpenseQuery = `
        UPDATE expenses
        SET ${fields.join(', ')}, updated_at = CURRENT_DATE
        WHERE id = $${index} AND user_id = $${index + 1}
        RETURNING id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const result = await database.query(updateExpenseQuery, values);

    if (result.length == 1) {
        const expense = result[0];

        if (typeof expense === "object") {
            return expense as ReadExpenseDTO;
        } else {
            throw new Error("Expense not found or no changes made");
        }
    } else {
        throw new Error("No expense was founded.");
    }
};

export async function deleteExpense(expenseID: string, userID: string): Promise<void> {
    const deleteExpenseQuery = `
        DELETE FROM expenses
        WHERE id = $1 AND user_id = $2;
    `;

    const values = [expenseID, userID];
    await database.query(deleteExpenseQuery, values);
};