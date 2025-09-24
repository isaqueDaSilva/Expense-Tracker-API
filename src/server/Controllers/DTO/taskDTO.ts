export interface CreateTaskDTO {
    title: string;
    description?: string | undefined;
    value: number;
    date: string;
    category?: string | undefined;
};

export interface ReadTaskDTO {
    id: string;
    title: string;
    description?: string;
    value: number;
    date: string;
    category: string | null;
    userID: string;
    createdAt: string;
    updatedAt: string;
};

export interface UpdateTaskDTO {
    title?: string | undefined;
    description?: string | undefined;
    value?: number | undefined;
    date?: string | undefined;
    category?: string | undefined;
};