import z from "zod";

export interface CreateUserDTO {
    username: string;
    email: string;
    encryptedPassword: string;
    encryptedConfirmPassword: string;
};

// MARK: VALIDATIONS

export function validateNewUser(user: CreateUserDTO): boolean {
    return z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must be at most 50 characters long"),
        email: z.email("Invalid email address")
    }).parse(user) != undefined ? true : false;
}

export function passwordValidation(password: string, confirmPassword: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password) && passwordRegex.test(confirmPassword)) {
        return password === confirmPassword ? true : false;
    } else {
        throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }
}