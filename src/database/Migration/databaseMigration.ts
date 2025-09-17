import type { NeonQueryFunction } from "@neondatabase/serverless";
import { usersTableSchema } from "../Models/user";
import { tasksTableSchema } from "../Models/tasks";
import { categoryTableSchema, groceries, leisure, electronics, utilities, clothing, health } from "../Models/category";
import { disabledTokensTableSchema } from "../Models/disabledTokens";

export async function databaseMigration(database: NeonQueryFunction<false, false>) {
    await database.query(usersTableSchema);
    await database.query(categoryTableSchema);
    await database.query(groceries)
    await database.query(leisure)
    await database.query(electronics)
    await database.query(utilities)
    await database.query(clothing)
    await database.query(health)
    await database.query(tasksTableSchema);
    await database.query(disabledTokensTableSchema);
}