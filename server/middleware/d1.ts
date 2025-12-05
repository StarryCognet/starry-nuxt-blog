import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { usersTable } from '../db/schema/user';
import { messagesTable } from '../db/schema/message';

const schema = {
  users: usersTable,
  messages: messagesTable
};

declare module 'h3' {
  interface H3EventContext {
    db: DrizzleD1Database<typeof schema>;
  }
}

export default defineEventHandler((event) => {
  // 从环境变量或绑定中获取数据库实例
  // 在开发环境中，nitro-cloudflare-dev 会自动将 DB 绑定注入
  // 这里使用更直接的方式获取数据库实例
  const db = drizzle((event.context.cloudflare?.env?.DB || globalThis.DB) as any, {
    schema
  });
  
  if (!db) {
    throw createError({
      statusCode: 500,
      message: 'Database connection not available. Make sure you have:\n1. Run "npx wrangler login" to authenticate with Cloudflare\n2. Configured wrangler.jsonc with your D1 database details\n3. Installed nitro-cloudflare-dev module'
    });
  }
  
  event.context.db = db;
});