import { database } from "../../app.js";
import type { ReadCategoryDTO } from "../../dtos/categoryDTO.js";

export async function createCategory(categoryTitle: string, userID: string): Promise<ReadCategoryDTO> {
    const newCategory = `
        INSERT INTO categories (title, created_by) VALUES ($1, $2) RETURNING id, title, created_at AS createdAt
    `;

    const values = [categoryTitle, userID];
    const result = await database.query(newCategory, values);

    if (result.length == 1) {
        const category = result[0];

        if (typeof category === "object") {
            return category as ReadCategoryDTO;
        } else {
            throw new Error("Failed to create new category.");
        }
    } else {
        throw new Error("No category was created.");
    }
};

export async function getAllCategories(userID: string, currentPage: number): Promise<ReadCategoryDTO[]> {
    if (currentPage >= 1) {
        const categoryPerPage = 10;
        const offset = (currentPage - 1) * categoryPerPage;

        const getCategories = `
            SELECT id, title, created_by, created_at AS createdAt
            FROM categories
            WHERE (created_by = $1 OR created_by IS NULL)
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `;

        const values = [userID, categoryPerPage, offset];
        const result = await database.query(getCategories, values);

        return result.map(row => row as ReadCategoryDTO);
    } else {
        throw new Error("Invalid page number. Page number must be 1 or greater.");
    }
};

export async function getCategoryByID(userID: string, categoryID: string): Promise<ReadCategoryDTO> {
    const getCategory = `
        SELECT id, title, created_at AS createdAt
        FROM categories
        WHERE id = $1 AND created_by = $2
    `;

    const values = [categoryID, userID];
    const result = await database.query(getCategory, values);

    if (result.length == 1) {
        const category = result[0];

        if (typeof category === "object") {
            return category as ReadCategoryDTO;
        } else {
            throw new Error("This category don't exist.");
        }
    } else {
        throw new Error("No category was founded.");
    }
};

export async function updateCategory(userID: string, categoryID: string, newTitle: string): Promise<ReadCategoryDTO> {
    const updateCategory = `
        UPDATE categories
        SET title = $1
        WHERE id = $2 AND created_by = $3
        RETURNING id, title, created_at AS createdAt
    `;

    const values = [newTitle, categoryID, userID];
    const result = await database.query(updateCategory, values);

    if (result.length == 1) {
        const updatedCategory = result[0];

        if (typeof updatedCategory === "object") {
            return updatedCategory as ReadCategoryDTO;
        } else {
            throw new Error("This category don't exist.");
        }
    } else {
        throw new Error("No category was founded.");
    }
};

export async function deleteCategory(categoryID: string, userID: string) {
    const deleteCategory = `
        DELETE FROM categories
        WHERE id = $1 AND created_by = $2
    `;

    const values = [categoryID, userID];
    await database.query(deleteCategory, values);
};