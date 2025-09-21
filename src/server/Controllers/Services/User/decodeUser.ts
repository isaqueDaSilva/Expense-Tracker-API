import { z } from "zod";
import { passwordValidation } from "../../Services/passwordValidation";
import type { CreateUserDTO } from "../../dto/userDTO";

// Function to decode and validate CreateUserDTO from JSON string
export function decodeCreateUserDTO(jsonString: string): CreateUserDTO {
    const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === 'username' || key === 'email' || key === 'password') {
            if (typeof value !== 'string') {
                throw new Error(`Invalid type for ${key}: expected string`);
            }
            return value;
        }
        return value;
    });

    return z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must be at most 50 characters long"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long").refine(passwordValidation, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        })
    }).parse(parsed);
}