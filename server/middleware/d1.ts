import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

// 扩展 H3 事件上下文类型
declare module 'h3' {
  interface H3EventContext {
    db: DrizzleD1Database<typeof schema>
  }
}

export default defineEventHandler(async ({ context }) => {
  // 从 Cloudflare 环境中获取 DB 绑定（名字必须和 wrangler.jsonc 中的 binding 一致）
  const { DB } = context.cloudflare!.env

  // 创建 Drizzle 实例并注入到上下文
  context.db = drizzle(DB, { schema })
})