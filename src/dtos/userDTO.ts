import { UUID } from "../app.js";

export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
};

export interface ReadUserDTO {
    id: UUID;
    email: string;
    username: string;
    createdAt: Date;
};

export interface ReadFullUserDTO {
    id: UUID;
    email: string;
    username: string;
    passwordhash: string;
    hasSession: boolean;
    lastLoggedDate: Date;
    createdAt: Date;
};