# 部署指南

本指南将帮助您将 Nuxt 博客项目部署到 Cloudflare Workers 上。

## 前置条件

1. 已安装 Node.js 和 pnpm
2. 拥有 Cloudflare 账号
3. 在 Cloudflare 上创建了一个 API Token

## 环境变量配置

1. 复制 `.env.example` 文件为 `.env`
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填写您的 Cloudflare 配置：
   ```
   # Cloudflare API Configuration
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

## 获取 Cloudflare API 令牌

1. 登录 Cloudflare 控制台
2. 前往 [API Tokens](https://dash.cloudflare.com/profile/api-tokens) 页面
3. 点击 "Create Token"
4. 选择 "Edit Cloudflare Workers"
5. 设置适当的权限并创建令牌
6. 复制生成的令牌到 `.env` 文件中

## 构建项目

```bash
pnpm install
pnpm run build
```

## 部署到 Cloudflare Workers

```bash
# 确保环境变量已正确设置
export CLOUDFLARE_API_TOKEN=your_api_token_here

# 运行部署命令
pnpm run deploy
```

## 常见问题排查

### 认证错误

如果您遇到类似以下错误：
```
Authentication error [code: 10000]
```

请检查：
1. `CLOUDFLARE_API_TOKEN` 是否正确设置
2. API 令牌是否具有足够的权限（至少需要 Workers 编辑权限）
3. 环境变量是否正确导出

### Worker 名称不匹配

如果您遇到 Worker 名称不匹配的警告，请确保：
- `wrangler.jsonc` 中的 `name` 字段设置为 `starry-nuxt-blog`
- `.env` 文件中的 `WORKER_NAME` 也设置为相同的值

### 数据库连接问题

如果遇到数据库连接问题，请检查：
- `wrangler.jsonc` 中的 D1 数据库配置是否正确
- 数据库 ID 和名称是否与 Cloudflare 控制台中的一致
