import type { NeonQueryFunction } from "@neondatabase/serverless";
import { usersTableSchema } from "../models/user.js";
import { expensesTableSchema } from "../models/expenses.js";
import {
  categoryTableSchema,
  groceries,
  leisure,
  electronics,
  utilities,
  clothing,
  health,
} from "../models/category.js";
import { sessionsTableSchema } from "../models/sessions.js";
import { databaseConfig } from "../../config/databaseConfig.js";

async function databaseMigration(database: NeonQueryFunction<false, false>) {
  await database.transaction([
    database.query(usersTableSchema),
    database.query(categoryTableSchema),
    database.query(groceries),
    database.query(leisure),
    database.query(electronics),
    database.query(utilities),
    database.query(clothing),
    database.query(health),
    database.query(expensesTableSchema),
    database.query(sessionsTableSchema),
  ]);
}

// Run migration
const database = databaseConfig();
await databaseMigration(database);
