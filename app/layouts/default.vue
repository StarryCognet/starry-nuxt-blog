<template>
  <div class="app-layout" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
    <BackgroundCanvas 
      v-model:is-dark="isDark" 
      ref="backgroundCanvasRef"
    />
    
    <MenuButton 
      :menu-open="menuOpen"
      @toggle="toggleMenu"
    />
    
    <NavigationMenu 
      :menu-open="menuOpen"
      :menu-items="menuItems"
    />
    
    <ThemeToggleButton 
      :is-dark="isDark"
      @toggle="toggleTheme"
      ref="themeToggleRef"
    />
    
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import anime from "animejs/lib/anime.es.js";

// --- 状态管理 ---
const isDark = ref(false);
const menuOpen = ref(false);
const isAnimatingTheme = ref(false);
const backgroundCanvasRef = ref<any>(null);
const themeToggleRef = ref<any>(null);

// Miku 主题色配置
const COLORS = {
  primary: "#39C5BB", // Miku Teal
  secondary: "#E6006F", // Magenta accent
  darkBg: "#05070a",
  lightBg: "#f0f2f5",
  darkText: "#ffffff",
  lightText: "#1a1d23",
};

// 菜单选项
const menuItems = [
  { id: 1, label: "首页", link: "blog.starrymiku.com" },
  { id: 2, label: "游戏", link: "tetris.games.starrycognition.cn" },
  { id: 3, label: "博文", link: "starrymiku.com" },
  { id: 4, label: "作品", link: "#" },
  { id: 5, label: "联系", link: "#" },
];

// --- 主题切换动画 (核心功能) ---
const toggleTheme = () => {
  if (isAnimatingTheme.value || !themeToggleRef.value || !backgroundCanvasRef.value) return;
  isAnimatingTheme.value = true;

  const btnEl = themeToggleRef.value.themeBtnRef;
  if (!btnEl) return;

  const btnRect = btnEl.getBoundingClientRect();
  // 计算圆心
  const centerX = btnRect.left + btnRect.width / 2;
  const centerY = btnRect.top + btnRect.height / 2;

  // 计算覆盖全屏所需的半径
  const maxDist = Math.max(
    Math.hypot(centerX, centerY),
    Math.hypot(window.innerWidth - centerX, centerY),
    Math.hypot(centerX, window.innerHeight - centerY),
    Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY)
  );

  // 创建临时的转场层
  const transitionLayer = document.createElement("div");
  transitionLayer.style.position = "fixed";
  transitionLayer.style.left = `${centerX}px`;
  transitionLayer.style.top = `${centerY}px`;
  transitionLayer.style.width = "0px";
  transitionLayer.style.height = "0px";
  transitionLayer.style.borderRadius = "50%";
  transitionLayer.style.backgroundColor = isDark.value ? COLORS.lightBg : COLORS.darkBg;
  transitionLayer.style.zIndex = "999";
  transitionLayer.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(transitionLayer);

  // 1. 圆形扩散动画
  anime({
    targets: transitionLayer,
    width: maxDist * 2.5, // 稍微大一点确保覆盖
    height: maxDist * 2.5,
    easing: "easeInOutQuad",
    duration: 600,
    complete: () => {
      // 2. 动画覆盖全屏后，切换实际的状态
      isDark.value = !isDark.value;

      // 3. 渐隐转场层
      anime({
        targets: transitionLayer,
        opacity: 0,
        duration: 400,
        easing: "linear",
        complete: () => {
          document.body.removeChild(transitionLayer);
          isAnimatingTheme.value = false;
        },
      });
    },
  });
};

// 切换菜单状态
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;

  // 使用anime.js添加菜单动画
  if (menuOpen.value) {
    // 使用anime.js库创建动画效果
    anime({
      // 设置动画目标元素为所有.menu-item类元素
      targets: ".menu-item",
      // 设置元素的X轴平移动画，从左侧100px移动到原始位置
      translateX: [function () {
        return anime.random(-600, 600);
      }, 0],
      translateY: [function () {
        return anime.random(-600, 600);
      }, 0],
      rotate: [function () {
        return anime.random(720, 0);
      }, 0],
      scale: [function () {
        return anime.random(1, 10);
      }, 1],
      // 设置元素的透明度动画，从完全透明到完全不透明
      opacity: [0, 1],
      // 设置动画延迟，每个元素依次延迟100ms执行
      delay: anime.stagger(100),
      // 动画持续时间，单位为毫秒
      duration: 1500,
      // 缓动函数类型，使用弹性缓动效果，参数为振幅1和周期0.6
      easing: "easeOutElastic(1, .6)",
    });
  }
};

onMounted(() => {
  // 初始化背景画布
  nextTick(() => {
    backgroundCanvasRef.value?.initCanvas();
    backgroundCanvasRef.value?.runAnimationLoop();
  });
});

onUnmounted(() => {
  backgroundCanvasRef.value?.stopAnimation();
});

// 暴露给父组件的方法
defineExpose({
  setBackgroundMousePosition: (x: number, y: number) => {
    backgroundCanvasRef.value?.setMousePosition(x, y);
  }
});
</script>

<style>
/* CSS 变量定义 - 核心主题控制 */
.app-layout {
  --transition-speed: 0.5s;
}

.dark-mode {
  --bg-color: #05070a;
  --text-color: #ffffff;
  --text-dim: #8892b0;
  --card-bg: rgba(255, 255, 255, 0.03);
  --card-border: rgba(255, 255, 255, 0.1);
  --primary: #39c5bb;
  --toggle-bg: rgba(255, 255, 255, 0.1);
}

.light-mode {
  --bg-color: #f0f2f5;
  --text-color: #1a1d23;
  --text-dim: #5c6b7f;
  --card-bg: rgba(255, 255, 255, 0.8);
  --card-border: rgba(0, 0, 0, 0.05);
  --primary: #39c5bb;
  --toggle-bg: rgba(0, 0, 0, 0.05);
}

@import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap");
</style>

<style scoped>
.app-layout {
  font-family: "Inter", sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  /* 关键：这里不再使用 transition background，而是依靠 anime.js 的遮罩层实现切换，
     这样性能更好且不会有闪烁 */
}

/* 主内容布局 */
.main-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>