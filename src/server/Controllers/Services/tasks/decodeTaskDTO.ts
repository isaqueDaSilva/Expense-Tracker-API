import { z } from 'zod';
import type { CreateTaskDTO } from '../../dto/taskDTO';

export function decodeCreateTaskDTO(jsonString: string): CreateTaskDTO {
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
}