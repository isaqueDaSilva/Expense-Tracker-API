import { database } from "../../../../app";
import type { ReadUserDTO } from "../../dto/userDTO";

export async function createUser(email: string, username: string, hashedPassword: string): Promise<ReadUserDTO> {
    const newUser = `
        INSERT INTO users (email, username, password)
        VALUES ($1, $2, $3)
        RETURNING id, email, username, is_logged AS "isLogged", last_logged_date AS "lastLoggedDate", created_at AS "createdAt";
    `;
    const values = [email, username, hashedPassword];
    const result = await database.query(newUser, values);
    const user = result[0];

    if (typeof user === "object") {
        return user.value as ReadUserDTO;
    } else {
        throw new Error("Failed to create user");
    }
};

export async function getUserByEmail(email: string): Promise<{userResponse: ReadUserDTO, passwordHash: string}> {
    const user = `
        SELECT id, email, username, password_hash AS passwordHash, is_logged AS "isLogged", last_logged_date AS "lastLoggedDate", created_at AS "createdAt"
        FROM users
        WHERE email = $1;
    `;

    const values = [email];
    const result = await database.query(user, values);
    const foundUser = result[0];

    if (typeof foundUser === "object") {
        return {userResponse: foundUser.value as ReadUserDTO, passwordHash: foundUser.value.passwordHash};
    } else {
        throw new Error("User not found");
    }
};

export async function updateUserLoginStatus(userID: string, isLogged: boolean): Promise<void> {
    const updateStatus = `
        UPDATE users
        SET is_logged = $1, last_logged_date = $2
        WHERE id = $3;
    `;

    const values = [isLogged, new Date().toISOString(), userID];
    await database.query(updateStatus, values);
}

export async function deleteUser(userID: string): Promise<void> {
    const deleteUserQuery = `
        DELETE FROM users
        WHERE id = $1;
    `;

    const values = [userID];
    await database.query(deleteUserQuery, values);
}