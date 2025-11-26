<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useFetch } from '#app';

// 获取路由参数
const route = useRoute();
const postId = route.params.id;

console.log('Article page loaded with ID:', postId);

// 使用useFetch获取文章详情
const { data, error, pending } = await useFetch(`/api/posts/${postId}`);

// 定义文章数据
const post = data.value?.data || null;
</script>

<template>
  <div class="article-detail-page">
    <h1>文章详情页 (替代路由版本)</h1>
    
    <!-- 加载状态 -->
    <div v-if="pending" class="loading">正在加载文章...</div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>获取文章失败：{{ error.message }}</p>
      <NuxtLink to="/blog" class="back-link">返回文章列表</NuxtLink>
    </div>
    
    <!-- 文章详情 -->
    <article v-else-if="post" class="article-content">
      <h2>{{ post.title }}</h2>
      
      <div class="article-meta">
        <span>作者: {{ post.author }}</span>
        <span>发布时间: {{ new Date(post.createdAt).toLocaleDateString() }}</span>
      </div>
      
      <div v-if="post.tags && post.tags.length > 0" class="article-tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      
      <div class="article-body">
        <p v-for="(paragraph, index) in post.content.split('\n')" :key="index">{{ paragraph }}</p>
      </div>
      
      <NuxtLink to="/blog" class="back-link">返回文章列表</NuxtLink>
    </article>
  </div>
</template>

<style scoped>
.article-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.article-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-dim);
  font-size: 0.9rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 0.2rem 0.8rem;
  font-size: 0.8rem;
}

.article-body {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.article-body p {
  margin-bottom: 1rem;
}

.back-link {
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.loading, .error {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-dim);
}

.error {
  color: #e53e3e;
}
</style>