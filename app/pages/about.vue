<script setup>
import { inject } from 'vue'

// 从布局注入主题状态
const isDark = inject('isDark', false)
</script>

<template>
  <div class="about-page">
    <header class="page-header">
      <h1>关于我们</h1>
      <p class="subtitle">了解我们的故事和理念</p>
    </header>
    
    <section class="content-section">
      <div class="card">
        <h2>我们的使命</h2>
        <p>创建一个连接技术与创意的平台，分享知识和经验。</p>
      </div>
      
      <div class="card">
        <h2>主题状态</h2>
        <p>当前主题: {{ isDark ? '深色模式' : '浅色模式' }}</p>
        <p>无论你在哪个页面，主题状态都会保持一致。</p>
      </div>
      
      <div class="card">
        <h2>设计原则</h2>
        <ul>
          <li>简洁直观的用户体验</li>
          <li>响应式设计适配各种设备</li>
          <li>流畅的动画和过渡效果</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-dim);
}

.content-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  color: var(--text-color);
  border-bottom: 2px solid var(--primary);
  padding-bottom: 0.5rem;
}

.card p, .card ul {
  color: var(--text-dim);
  line-height: 1.6;
}

.card ul {
  padding-left: 1.5rem;
}

@media (max-width: 768px) {
  .about-page {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .content-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>