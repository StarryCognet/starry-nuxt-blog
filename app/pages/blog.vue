<script setup>
import { useFetch } from '#app';

// 使用Nuxt 4的useFetch钩子来获取API数据
const { data, error, pending } = await useFetch('/api/posts');

// 定义文章列表数据
const posts = data.value?.data || [];
</script>

<template>
  <div class="blog-page">
    <h1>博客文章</h1>
    
    <!-- 加载状态 -->
    <div v-if="pending" class="loading">正在加载文章...</div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>获取文章失败：{{ error.message }}</p>
    </div>
    
    <!-- 文章列表 -->
    <div v-else class="posts-container">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <h2>{{ post.title }}</h2>
        <p class="post-meta">
          <span>作者: {{ post.author }}</span>
          <span>发布时间: {{ new Date(post.createdAt).toLocaleDateString() }}</span>
        </p>
        <p class="post-excerpt">{{ post.content.substring(0, 100) }}...</p>
        <NuxtLink :to="{ path: `/article/${post.id}` }" class="read-more">
          阅读更多 →
        </NuxtLink>
      </div>
    </div>
    
    <!-- 无文章状态 -->
    <div v-if="!pending && !error && posts.length === 0" class="empty">
      <p>暂无文章</p>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-color);
  text-align: center;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-item {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.post-item h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.post-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  color: var(--text-dim);
  font-size: 0.9rem;
}

.post-excerpt {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.read-more {
  display: inline-block;
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: var(--primary);
  text-decoration: underline;
}

.loading, .error, .empty {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-dim);
}

.error {
  color: #e53e3e;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-page {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .post-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>