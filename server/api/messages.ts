import { messagesTable } from '../db/schema/message';

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
    
    // 查询messages表中的所有数据
    const messages = await db.select().from(messagesTable);
    
    return {
      message: 'Successfully retrieved messages',
      data: messages,
      count: messages.length
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      message: 'Error retrieving messages',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});