export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
};

export interface ReadUserDTO {
    id: string;
    username: string;
    email: string;
    isLogged: boolean;
    lastLoggedDate: Date;
    createdAt: Date;
};