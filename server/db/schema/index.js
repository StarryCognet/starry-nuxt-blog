import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

// 你的 messages 表（与你现有数据库结构匹配）
export const messages = sqliteTable("messages", {
  id: int().primaryKey({ autoIncrement: true }),
  user: text().notNull(),
  msg: text().notNull(),
  likes: int().default(0),
  created_at: int().notNull(),
});

// 如果你还需要其他表，可以继续在这里定义
// export const users = sqliteTable('users', { ... })
