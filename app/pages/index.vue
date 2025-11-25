<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import anime from "animejs/lib/anime.es.js";

// 从布局注入的主题状态
const isDark = inject('isDark', false);

// --- 状态管理 ---
const activeNode = ref<number | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);

// 内容节点数据
const nodes = [
  { id: 1, title: "39 MUSIC", subtitle: "听觉共鸣", icon: "🎵", desc: "收藏的电子音乐与 Voca 创作灵感。" },
  { id: 2, title: "CODE LAB", subtitle: "创造界限", icon: "⚡", desc: "前端实验、WebGL 特效与交互式组件库。" },
  { id: 3, title: "VISUALS", subtitle: "视觉印象", icon: "👁️", desc: "摄影、设计稿与 Miku 相关同人收录。" },
  { id: 4, title: "LOGS", subtitle: "思维碎片", icon: "📡", desc: "非线性的生活记录与开发日志。" },
];

// 模拟更多内容 - 文章/动态
const posts = [
  { id: 101, date: "2024.05.20", title: "使用 Nuxt 3 构建沉浸式体验", tag: "DEV" },
  { id: 102, date: "2024.05.18", title: "Magical Mirai 2024 参战预定", tag: "LIFE" },
  { id: 103, date: "2024.05.15", title: "WebGL 粒子系统的性能优化笔记", tag: "TECH" },
  { id: 104, date: "2024.05.10", title: "重新定义赛博朋克 UI 设计语言", tag: "DESIGN" },
  { id: 105, date: "2024.05.01", title: "Hello, World from the Digital Sea", tag: "META" },
];

// --- 滚动动画监听 ---
const observeScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 使用 anime.js 触发入场
          anime({
            targets: entry.target,
            translateY: [50, 0], // 加大动画幅度
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutExpo",
          });
          observer.unobserve(entry.target); // 只触发一次
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".scroll-animate").forEach((el) => observer.observe(el));
};

// 节点点击交互
const handleNodeClick = async (id: number) => {
  const isOpening = activeNode.value !== id;
  activeNode.value = isOpening ? id : null;
  if (isOpening) {
    await new Promise(resolve => setTimeout(resolve, 0)); // 等待DOM更新
    anime({
      targets: ".node-content",
      height: [0, "auto"], // 高度动画
      opacity: [0, 1],
      duration: 400,
      easing: "easeOutQuad",
    });
  }
};

onMounted(() => {
  // 延迟启动滚动监听，等待 DOM 渲染
  setTimeout(observeScroll, 100);
  
  window.addEventListener("mousemove", (e) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
    
    // 更新背景画布中的鼠标位置
    const app = document.querySelector('.app-layout');
    if (app) {
      // 获取Vue组件实例并调用方法
      const vueInstance = (app as any).__vueParentComponent;
      if (vueInstance && vueInstance.ctx && vueInstance.ctx.setBackgroundMousePosition) {
        vueInstance.ctx.setBackgroundMousePosition(e.clientX, e.clientY);
      }
    }
  });
});
</script>

<template>
  <div>
    <!-- 通过inject获取布局中的isDark状态 -->
    <HeroSection :is-dark="isDark" />
    
    <!-- 核心导航网格 -->
    <section class="grid-container">
      <div class="grid-system">
        <NodeCard
          v-for="node in nodes"
          :key="node.id"
          :node="node"
          :is-active="activeNode === node.id"
          :active-node-id="activeNode"
          @select="handleNodeClick"
        />
      </div>
    </section>
    
    <PostList :posts="posts" />
    
    <AppFooter :mouse-x="mouseX" :mouse-y="mouseY" />
  </div>
</template>

<style scoped>
/* 网格卡片区域 */
.grid-container {
  margin-bottom: 6rem;
}

.grid-system {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  perspective: 1000px;
}

/* --- 移动端适配 (响应式) --- */
@media (max-width: 1024px) {
  .grid-system {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-system {
    grid-template-columns: 1fr;
    /* 手机单列 */
    gap: 1rem;
  }
}
</style>