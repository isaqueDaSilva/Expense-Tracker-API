import { json, z } from 'zod'
import type { CategoryDTO } from '../../dto/categoryDTO.js';

function decodeCategoryDTO(jsonString: string, isCreation: boolean): CategoryDTO {
    const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === 'title') {
            if (typeof value !== 'string') {
                throw new Error(`Invalid type for ${key}: Expected string`)
            }

            return value
        }

        return value;
    });

    if (isCreation) {
        return z.object({
            title: z.string().min(1, "Title cannot be empty").max(100, "Title must be at most 100 characters long")
        }).parse(parsed);
    } else {
        return z.object({
            title: z.string().min(1, "Title cannot be empty").max(100, "Title must be at most 100 characters long").optional()
        }).parse(parsed);
    };
};

export function decodeCreateCategoryDTO(jsonString: string): CategoryDTO {
    return decodeCategoryDTO(jsonString, true)
};

export function decodeUpdateCategoryDTO(jsonString: string): CategoryDTO {
    return decodeCategoryDTO(jsonString, false)
}