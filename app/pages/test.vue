<script setup>
// 测试路由导航
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToPost = (id) => {
  console.log('手动导航到文章ID:', id);
  router.push(`/blog/${id}`);
};
</script>

<template>
  <div class="test-page">
    <h1>路由测试页面</h1>
    
    <div class="test-links">
      <h2>测试链接:</h2>
      <ul>
        <li><NuxtLink to="/blog">博客列表页</NuxtLink></li>
        <li><NuxtLink to="/blog/1">文章详情页 (ID: 1)</NuxtLink></li>
        <li><NuxtLink to="/blog/2">文章详情页 (ID: 2)</NuxtLink></li>
      </ul>
    </div>
    
    <div class="test-buttons">
      <h2>手动导航按钮:</h2>
      <button @click="navigateToPost(1)">使用router.push导航到文章1</button>
      <button @click="navigateToPost(2)">使用router.push导航到文章2</button>
    </div>
    
    <div class="debug-info">
      <h2>调试信息:</h2>
      <p>请在浏览器控制台查看导航日志</p>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  color: var(--text-color);
  margin-bottom: 2rem;
}

.test-links, .test-buttons, .debug-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--card-border);
}

h2 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

button:hover {
  opacity: 0.9;
}
</style>