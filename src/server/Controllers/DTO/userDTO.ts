import { UUID } from "../../../app.js";

export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
};

export interface ReadUserDTO {
    id: UUID;
    username: string;
    email: string;
    isLogged: boolean;
    lastLoggedDate: Date;
    createdAt: Date;
};