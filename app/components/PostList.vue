<template>
  <section class="content-section">
    <div class="section-header scroll-animate">
      <span class="section-tag">/// RECENT LOGS</span>
      <h3>最新传输</h3>
    </div>

    <div class="post-list">
      <div v-for="post in posts" :key="post.id" class="post-item scroll-animate">
        <div class="post-meta">
          <span class="post-date">{{ post.date }}</span>
          <span class="post-tag">[{{ post.tag }}]</span>
        </div>
        <h4 class="post-title">{{ post.title }}</h4>
        <div class="post-arrow">-></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Post {
  id: number;
  date: string;
  title: string;
  tag: string;
}

defineProps<{
  posts: Post[];
}>();
</script>

<style scoped>
.content-section {
  padding-bottom: 4rem;
}

.section-header {
  margin-bottom: 2rem;
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
  opacity: 0;
  /* 初始隐藏，滚动触发 */
}

.section-tag {
  font-family: monospace;
  color: var(--primary);
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
}

.section-header h3 {
  font-size: 2rem;
  margin: 0;
  color: var(--text-color);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: var(--card-bg);
  border-bottom: 1px solid var(--card-border);
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0;
  /* 初始隐藏 */
}

.post-item:hover {
  background: rgba(57, 197, 187, 0.05);
  padding-left: 2rem;
  border-bottom-color: var(--primary);
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-family: monospace;
  color: var(--text-dim);
  min-width: 150px;
}

.post-title {
  flex: 1;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.post-arrow {
  color: var(--primary);
  font-family: monospace;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}

.post-item:hover .post-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* --- 移动端适配 (响应式) --- */
@media (max-width: 768px) {
  .post-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .post-meta {
    font-size: 0.8rem;
  }

  .post-arrow {
    display: none;
  }
}
</style>