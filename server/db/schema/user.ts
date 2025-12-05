import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  userId: int().primaryKey({ autoIncrement: true }),
  userName: text().notNull(),
  userEmail: text().notNull().unique(),
  userPassword: text().notNull(),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
});
