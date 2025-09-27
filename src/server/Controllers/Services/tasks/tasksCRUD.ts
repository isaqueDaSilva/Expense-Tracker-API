import { database } from "../../../../app.js";
import type { CreateTaskDTO, ReadTaskDTO, UpdateTaskDTO } from "../../dto/taskDTO.js";

export async function createTask(CreateTaskDTO: CreateTaskDTO, userID: string): Promise<ReadTaskDTO> {
    const fields = [];
    const values = [];
    const indices = [];
    let index = 1;

    for (const [key, value] of Object.entries(CreateTaskDTO)) {
    fields.push(key); // Insert field name;
    values.push(value); // Insert field value;
    indices.push(`$${index}`); // Insert placeholder;
    index++; // Increment index for the next placeholder;
    }

    values.push(userID); // Add userID for the user_id field 
    fields.push('user_id'); // Add user_id field;
    indices.push(`$${index}`); // Add placeholder for user_id;

    const newTask = `
        INSERT INTO tasks (${fields.join(', ')})
        VALUES (${indices.join(', ')})
        RETURNING id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt";
    `;
    
    const result = await database.query(newTask, values);

    if (result.length == 1) {
        const task = result[0];

        if (typeof task === "object") {
            return task as ReadTaskDTO;
        } else {
            throw new Error("Failed to create task");
        }
    } else {
        throw new Error("No task was created.");
    }
};

export async function getAllTasks(userID: string, currentPage: number): Promise<ReadTaskDTO[]> {
    if (currentPage >= 1) {
        const tasksPerPage = 10;
        const offset = (currentPage - 1) * tasksPerPage;

        const getTasks = `
            SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM tasks
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
        `;

        const values = [userID, tasksPerPage, offset];
        const result = await database.query(getTasks, values);
        return result.map(row => row as ReadTaskDTO);
    } else {
        throw new Error("Invalid page number. Page number must be 1 or greater.");
    }
};

export async function getAllTasksByCategory(userID: string, categoryID: string, currentPage: number): Promise<ReadTaskDTO[]> {
    if (currentPage >= 1) {
        const tasksPerPage = 10;
        const offset = (currentPage - 1) * tasksPerPage;

        const getTasks = `
            SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM tasks
            WHERE user_id = $1 AND category = $2
            ORDER BY created_at DESC
            LIMIT $3 OFFSET $4;
        `;

        const values = [userID, categoryID, tasksPerPage, offset];
        const result = await database.query(getTasks, values);
        return result.map(row => row as ReadTaskDTO);
    } else {
        throw new Error("Invalid page number. Page number must be 1 or greater.");
    }
};

export async function getTasksByDate(userID: string, initialDate: string, finalDate: string, currentPage: number): Promise<ReadTaskDTO[]> {
    if (currentPage >= 1) {
        const tasksPerPage = 10;
        const offset = (currentPage - 1) * tasksPerPage;

        const getTasks = `
            SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM tasks
            WHERE user_id = $1 AND date BETWEEN $2 AND $3
            ORDER BY created_at DESC
            LIMIT $4 OFFSET $5
        `;

        const values = [userID, initialDate, finalDate, tasksPerPage, offset];
        const result = await database.query(getTasks, values);
    return result.map(row => row as ReadTaskDTO);
    } else {
        throw new Error("Invalid page number. Page number must be 1 or greater.");
    }
};

export async function getTaskByID(taskID: string, userID: string): Promise<ReadTaskDTO> {
    const getTask = `
        SELECT id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt"
        FROM tasks
        WHERE id = $1 AND user_id = $2;
    `;

    const values = [taskID, userID];
    const result = await database.query(getTask, values);

    if (result.length == 1) {
        const task = result[0];

        if (typeof task === "object") {
            return task as ReadTaskDTO;
        } else {
            throw new Error("Task not found");
        }
    } else {
        throw new Error("No task was founded.");
    }
};

export async function updateTask(updatedTask: UpdateTaskDTO, taskID: string, userID: string): Promise<ReadTaskDTO> {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updatedTask)) {
        fields.push(`${key} = $${index}`); // Insert field name and placeholder
        values.push(value); // Insert field value
        index++; // Increment index for the next placeholder
    }

    values.push(taskID, userID); // Add taskID and userID for the WHERE clause

    const updateTaskQuery = `
        UPDATE tasks
        SET ${fields.join(', ')}, updated_at = CURRENT_DATE
        WHERE id = $${index} AND user_id = $${index + 1}
        RETURNING id, title, description, value, date, category, user_id AS "userID", created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const result = await database.query(updateTaskQuery, values);

    if (result.length == 1) {
        const task = result[0];

        if (typeof task === "object") {
            return task as ReadTaskDTO;
        } else {
            throw new Error("Task not found or no changes made");
        }
    } else {
        throw new Error("No task was founded.");
    }
};

export async function deleteTask(taskID: string, userID: string): Promise<void> {
    const deleteTaskQuery = `
        DELETE FROM tasks
        WHERE id = $1 AND user_id = $2;
    `;

    const values = [taskID, userID];
    await database.query(deleteTaskQuery, values);
};