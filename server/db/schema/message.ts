import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const messagesTable = sqliteTable('messages', {
  id: int().primaryKey({ autoIncrement: true }),
  user: text().notNull(),
  msg: text().notNull(),
  likes: int().default(0),
  created_at: int().notNull()
})