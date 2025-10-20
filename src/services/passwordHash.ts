import bcrypt from "bcrypt";

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the cost factor as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Function to compare a plain password with a hashed password
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}