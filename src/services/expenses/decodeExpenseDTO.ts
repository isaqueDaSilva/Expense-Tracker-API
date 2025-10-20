import { z } from 'zod';
import type { CreateExpenseDTO, ExpenseSearch, UpdateExpenseDTO } from '../../dtos/expenseDTO.js';

export function decodeCreateExpenseDTO(jsonString: string): CreateExpenseDTO {
    const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === 'title' || key === 'description' || key === 'date' || key === 'category') {
            if (typeof value !== 'string') {
                throw new Error(`Invalid type for ${key}: expected string`);
            }
            return value;
        }
        if (key === 'value') {
            if (typeof value !== 'number') {
                throw new Error(`Invalid type for ${key}: expected number`);
            }
            return value;
        }
        return value;
    });

    return z.object({
        title: z.string().min(1, "Title cannot be empty").max(100, "Title must be at most 100 characters long"),
        description: z.string().max(500, "Description must be at most 500 characters long").optional(),
        value: z.number().min(0.1, "Value must be at least 0.1"),
        date: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format"
        }),
        category: z.uuid("Invalid category ID").optional()
    }).parse(parsed);
};

export function decodeUpdateExpenseDTO(jsonString: string): UpdateExpenseDTO {
    const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === 'title' || key === 'description' || key === 'date' || key === 'category') {
            if (typeof value !== 'string') {
                throw new Error(`Invalid type for ${key}: expected string`);
            }
            return value;
        }
        if (key === 'value') {
            if (typeof value !== 'number') {
                throw new Error(`Invalid type for ${key}: expected number`);
            }
            return value;
        }
        return value;
    });

    return z.object({
        title: z.string().min(1, "Title cannot be empty").max(100, "Title must be at most 100 characters long").optional(),
        description: z.string().max(500, "Description must be at most 500 characters long").optional(),
        value: z.number().min(0.1, "Value must be at least 0.1").optional(),
        date: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format"
        }).optional(),
        category: z.uuid("Invalid category ID").optional()
    }).parse(parsed);
};

export function decodeExpenseSearch(jsonString: string): ExpenseSearch {
    const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === 'initialDate' || key === 'finalDate') {
            if (typeof value !== 'string') {
                throw new Error(`Invalid type for ${key}: expected string`);
            }

            return value
        }

        return value
    });

    return z.object({
        initialDate: z.string().refine((initialDate) => !isNaN(Date.parse(initialDate)), {
            message: "Invalid date format"
        }),
        finalDate: z.string().refine((finalDate) => !isNaN(Date.parse(finalDate)), {
            message: "Invalid date format"
        })
    }).parse(parsed);
}