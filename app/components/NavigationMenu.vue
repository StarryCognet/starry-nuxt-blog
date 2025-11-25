<template>
  <nav class="menu-bar" :class="{ open: menuOpen }">
    <ul class="menu-list">
      <li v-for="item in menuItems" :key="item.id" class="menu-item">
        <a :href="item.link">{{ item.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
interface MenuItem {
  id: number;
  label: string;
  link: string;
}

defineProps<{
  menuOpen: boolean;
  menuItems: MenuItem[];
}>();
</script>

<style scoped>
.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 移除固定的背景色，使用CSS变量 */
  background: var(--menu-bg, rgba(5, 7, 10, 0.8));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.menu-bar.open {
  opacity: 1;
  visibility: visible;
}

/* 为深色和浅色模式分别设置菜单背景 */
:global(.dark-mode) .menu-bar {
  --menu-bg: rgba(5, 7, 10, 0.8);
}

:global(.light-mode) .menu-bar {
  --menu-bg: rgba(240, 242, 245, 0.8);
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
}

.menu-item {
  margin: 2rem 0;
  opacity: 0;
}

.menu-item a {
  color: var(--text-color);
  font-size: 2rem;
  text-decoration: none;
  font-weight: bold;
  position: relative;
  padding: 0.5rem 1rem;
}

.menu-item a::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s ease;
}

.menu-item a:hover::after {
  width: 100%;
}

/* --- 移动端适配 (响应式) --- */
@media (max-width: 1024px) {
  .menu-item a {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .menu-item {
    margin: 1.5rem 0;
  }

  .menu-item a {
    font-size: 1.2rem;
  }
}
</style>