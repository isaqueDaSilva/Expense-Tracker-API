import { NeonQueryPromise } from "@neondatabase/serverless";
import { database } from "../../app.js";
import type { ReadFullUserDTO, ReadUserDTO } from "../../dtos/userDTO.js";

export async function createUser(email: string, username: string, hashedPassword: string): Promise<ReadUserDTO> {
    const newUser = `
        INSERT INTO users (email, username, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, email, username, created_at AS "createdAt";
    `;
    const values = [email, username, hashedPassword];
    const result = await database.query(newUser, values);

    if (result.length == 1) {
        const user = result[0];

        if (typeof user === "object") {
            return user as ReadUserDTO;
        } else {
            throw new Error("Failed to create user");
        }
    } else {
        throw new Error("No user was created");
    }
};

export async function getUserByEmail(email: string): Promise<ReadFullUserDTO> {
    const user = `
        SELECT id, email, username, password_hash AS passwordHash, last_logged_date AS "lastLoggedDate", created_at AS "createdAt",
        EXISTS (SELECT 1 FROM sessions WHERE user_id = users.id) AS "hasSession"
        FROM users
        WHERE email = $1;
    `;

    const values = [email];
    const result = await database.query(user, values);

    console.log(result[0])

    if (result.length == 1) {
        const foundUser = result[0] as ReadFullUserDTO;

        if (typeof foundUser === "object") {
            return foundUser;
        } else {
            throw new Error("User not found");
        }
    } else {
        throw new Error("No user was founded");
    }
};

export function deleteUser(userID: string): NeonQueryPromise<false, false, Record<string, any>[]> {
    const deleteUserQuery = `
        DELETE FROM users
        WHERE id = $1;
    `;

    const values = [userID];
    return database.query(deleteUserQuery, values);
}