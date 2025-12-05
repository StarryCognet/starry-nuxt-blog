import { usersTable } from "../db/schema/user";
export default defineEventHandler(async (event) => {
  try {
    // 从上下文中获取数据库实例
    const db = event.context.db;
    
    if (!db) {
      throw createError({
        statusCode: 500,
        message: 'Database not available in context'
      });
    }
    
    // 测试数据库查询 - 获取所有用户
    const users = await db.select().from(usersTable);
    
    return {
      message: 'Hello from Nuxt 4 with Cloudflare D1!',
      database: 'Connected successfully',
      users: users || []
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      message: 'Hello from Nuxt 4!',
      database: 'Error connecting to database',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});