import { UUID } from "../../../app.js";

export interface CategoryDTO {
    title?: string | undefined;
};

export interface ReadCategoryDTO {
    id: UUID;
    title: string;
    createdAt: string;
};