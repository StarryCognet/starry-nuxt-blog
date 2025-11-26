import { messages } from '../db/schema'

export default defineEventHandler(async (event) => {
  try {
    const { db } = event.context

    // 移除 limit，查询所有数据
    const data = await db.select().from(messages).all()

    return {
      success: true,
      count: data.length,
      data,
      message: '数据库读取成功！'
    }
  } catch (error) {
    console.error('数据库错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '数据库查询失败'
    })
  }
})