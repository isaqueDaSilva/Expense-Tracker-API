import type { NeonQueryFunction } from "@neondatabase/serverless";
import { usersTableSchema } from "../models/user.js";
import { tasksTableSchema } from "../models/tasks.js";
import { categoryTableSchema, groceries, leisure, electronics, utilities, clothing, health } from "../models/category.js";
import { disabledTokensTableSchema } from "../models/disabledTokens.js";
import { databaseConfig } from "../configuration/databaseConfig.js";
import * as dotenv from 'dotenv';

dotenv.config();

async function databaseMigration(database: NeonQueryFunction<false, false>) {
    await database.transaction(
        [
            database.query(usersTableSchema),
            database.query(categoryTableSchema),
            database.query(groceries),
            database.query(leisure),
            database.query(electronics),
            database.query(utilities),
            database.query(clothing),
            database.query(health),
            database.query(tasksTableSchema),
            database.query(disabledTokensTableSchema)
        ]
    )
};

// Run migration
const database = databaseConfig();
await databaseMigration(database);