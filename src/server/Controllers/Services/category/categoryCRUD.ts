import { database } from "../../../../app";
import type { ReadCategoryDTO } from "../../dto/categoryDTO";

export async function createCategory(categoryTitle: string, userID: string): Promise<ReadCategoryDTO> {
    const newCategory = `
        INSERT INTO categories (title) VALUES ($1) RETURNING id, title, created_at AS createdAt
    `;

    const values = [categoryTitle];
    const result = await database.query(newCategory, values);
    const category = result[0]

    if (typeof category === "object") {
        return category.value as ReadCategoryDTO
    } else {
        throw new Error("Failed to create new category.")
    }
}

export async function getAllCategories(userID: string, currentPage: number): Promise<ReadCategoryDTO[]> {
    if (currentPage >= 1) {
        const categoryPerPage = 10
        const offset = (currentPage - 1) * categoryPerPage;

        const getCategories = `
            SELECT id, title, created_at AS createdAt
            FROM categories
            WHERE user_id = $1 OR user_id = NULL
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `;

        const values = [userID, categoryPerPage, offset];
        const result = await database.query(getCategories, values);
        return result.map(row => row.value as ReadCategoryDTO);
    } else {
        throw new Error("Invalid page number. Page number must be 1 or greater.")
    }
};

export async function getCategoryByID(userID: string, categoryID: string): Promise<ReadCategoryDTO> {
    const getCategory = `
        SELECT id, title, created_at AS createdAt
        FROM categories
        WHERE id = $2 AND user_id = $1
    `;

    const values = [userID, categoryID];
    const result = await database.query(getCategory, values);
    const category = result[0];

    if (typeof category === "object") {
        return category.value as ReadCategoryDTO;
    } else {
        throw new Error("This category don't exist.");
    }
};

export async function updateCategory(userID: string, categoryID: string, newTitle: string): Promise<ReadCategoryDTO> {
    const updateCategory = `
        UPDATE categories
        SET title = $1
        WHERE id = $2 AND user_id = $3
        RETURNING id, title, created_at AS createdAt
    `;

    const values = [newTitle, categoryID, userID];
    const result = await database.query(updateCategory, values);
    const updatedCategory = result [0]

    if (typeof updatedCategory === "object") {
        return updatedCategory.value as ReadCategoryDTO;
    } else {
        throw new Error("This category don't exist.");
    }
};

export async function deleteCategory(categoryID: string, userID: string): Promise<void> {
    const deleteCategory = `
        DELETE FROM categories
        WHERE id = $1 AND user_id = $2
    `;

    const values = [categoryID, userID];
    await database.query(deleteCategory, values);
}