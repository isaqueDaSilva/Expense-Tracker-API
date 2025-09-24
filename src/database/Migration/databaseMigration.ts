import type { NeonQueryFunction } from "@neondatabase/serverless";
import { usersTableSchema } from "../models/user.js";
import { tasksTableSchema } from "../models/tasks.js";
import { categoryTableSchema, groceries, leisure, electronics, utilities, clothing, health } from "../models/category.js";
import { disabledTokensTableSchema } from "../models/disabledTokens.js";
import { database } from "../../app.js";

export async function databaseMigration(database: NeonQueryFunction<false, false>) {
    await database.query(usersTableSchema);
    await database.query(categoryTableSchema);
    await database.query(groceries);
    await database.query(leisure);
    await database.query(electronics);
    await database.query(utilities);
    await database.query(clothing);
    await database.query(health);
    await database.query(tasksTableSchema);
    await database.query(disabledTokensTableSchema);
};

// Run migration
databaseMigration(database);