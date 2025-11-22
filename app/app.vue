<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, nextTick, watch } from "vue";
// 保持你验证过可用的导入路径
import anime from "animejs/lib/anime.es.js";

// --- 状态管理 ---
const isDark = ref(false);
const activeNode = ref<number | null>(null);
const isAnimatingTheme = ref(false);
const menuOpen = ref(false);

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

// --- Canvas 星空背景逻辑 ---
const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;
let particles: Particle[] = [];
const mouse = reactive({ x: -1000, y: -1000 });

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = "rgba(255, 255, 255, 0.8)"; // 默认颜色
    this.setColor();
  }

  setColor() {
    // 根据深浅模式调整粒子颜色
    const baseColor = isDark.value ? "255, 255, 255" : "30, 30, 30";
    this.color = Math.random() > 0.9 ? COLORS.primary : `rgba(${baseColor}, ${isDark.value ? 0.8 : 0.4})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > window.innerWidth) this.x = 0;
    if (this.x < 0) this.x = window.innerWidth;
    if (this.y > window.innerHeight) this.y = 0;
    if (this.y < 0) this.y = window.innerHeight;
  }

  draw() {
    if (!ctx) return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const initCanvas = () => {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight; // Canvas 始终全屏，不随内容滚动

  const particleCount = Math.min(80, window.innerWidth / 15);
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(window.innerWidth, window.innerHeight));
  }
};

const runAnimationLoop = () => {
  if (!ctx || !canvasRef.value) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  particles.forEach((p1, i) => {
    p1.update();
    p1.draw();

    // 连线逻辑
    for (let j = i; j < particles.length; j++) {
      const p2 = particles[j];
      if (!p2) continue;
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx!.beginPath();
        const alpha = 1 - distance / 100;
        // 连线颜色也需要适配主题
        ctx!.strokeStyle = isDark.value ? `rgba(57, 197, 187, ${alpha})` : `rgba(57, 197, 187, ${alpha * 0.6})`;
        ctx!.lineWidth = 0.5;
        ctx!.moveTo(p1.x, p1.y);
        ctx!.lineTo(p2.x, p2.y);
        ctx!.stroke();
      }
    }

    // 鼠标交互连线
    const dx = p1.x - mouse.x;
    const dy = p1.y - mouse.y;
    // 滚动时需要加上 scrollY 修正鼠标在 Canvas 上的相对位置
    // 但这里 Canvas 是 fixed 的，所以不需要加 scrollY
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 150) {
      ctx!.beginPath();
      ctx!.strokeStyle = isDark.value ? `rgba(255, 255, 255, ${1 - distance / 150})` : `rgba(0, 0, 0, ${1 - distance / 150})`;
      ctx!.lineWidth = 1;
      ctx!.moveTo(p1.x, p1.y);
      ctx!.lineTo(mouse.x, mouse.y);
      ctx!.stroke();
    }
  });

  animationFrameId = requestAnimationFrame(runAnimationLoop);
};

// --- 主题切换动画 (核心功能) ---
const themeBtnRef = ref<HTMLElement | null>(null);
const toggleTheme = () => {
  if (isAnimatingTheme.value || !themeBtnRef.value) return;
  isAnimatingTheme.value = true;

  const btnRect = themeBtnRef.value.getBoundingClientRect();
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

      // 更新粒子颜色
      particles.forEach((p) => p.setColor());

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
      translateX: [function() {
        return anime.random(-600, 600);
      }, 0],
      translateY: [function() {
        return anime.random(-600, 600);
      }, 0],
      rotate: [function() {
        return anime.random(720, 0);
      }, 0],
      scale: [function() {
        return anime.random(1, 10);
      }, 1],
      // 设置元素的透明度动画，从完全透明到完全不透明
      opacity: [0, 1],
      // 设置动画延迟，每个元素依次延迟100ms执行
      delay: anime.stagger(100),
      // 动画持续时间，单位为毫秒
      duration: 1000,
      // 缓动函数类型，使用弹性缓动效果，参数为振幅1和周期0.6
      easing: "easeOutElastic(1, .6)",
    });
  }
};

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

// --- 生命周期 ---
onMounted(() => {
  initCanvas();
  runAnimationLoop();

  // 延迟启动滚动监听，等待 DOM 渲染
  setTimeout(observeScroll, 100);

  window.addEventListener("resize", initCanvas);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // 初始入场动画
  const tl = anime.timeline({
    easing: "easeOutExpo",
    duration: 1000,
  });

  tl.add({
    targets: ".miku-title",
    translateY: [-50, 0],
    opacity: [0, 1],
    duration: 1200,
  })
    .add(
      {
        targets: ".hero-desc",
        opacity: [0, 1],
        translateY: [20, 0],
      },
      "-=800"
    )
    .add(
      {
        targets: ".node-card",
        translateY: [150, 0], // 加大卡片动画幅度
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: "easeOutElastic(1, .6)",
      },
      "-=600"
    );
});

onUnmounted(() => {
  window.removeEventListener("resize", initCanvas);
  cancelAnimationFrame(animationFrameId);
});

// 节点点击交互
const handleNodeClick = async (id: number) => {
  const isOpening = activeNode.value !== id;
  activeNode.value = isOpening ? id : null;
  if (isOpening) {
    await nextTick();
    anime({
      targets: ".node-content",
      height: [0, "auto"], // 高度动画
      opacity: [0, 1],
      duration: 400,
      easing: "easeOutQuad",
    });
  }
};
</script>

<template>
  <!-- 动态绑定 class 以控制 CSS 变量 -->
  <div class="app-root" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
    <!-- 固定背景 -->
    <div class="bg-layer">
      <canvas ref="canvasRef" class="bg-canvas"></canvas>
      <div class="noise-overlay"></div>
    </div>

    <!-- 菜单按钮 -->
    <button class="menu-toggle-btn" @click="toggleMenu" aria-label="Toggle Menu">
      <div class="hamburger" :class="{ open: menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <!-- 菜单栏 -->
    <nav class="menu-bar" :class="{ open: menuOpen }">
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.id" class="menu-item">
          <a :href="item.link">{{ item.label }}</a>
        </li>
      </ul>
    </nav>

    <!-- 右上角主题切换按钮 -->
    <button ref="themeBtnRef" class="theme-toggle-btn" @click="toggleTheme" aria-label="Toggle Theme">
      <div class="icon-container">
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
      </div>
    </button>

    <!-- 主内容区域 (允许滚动) -->
    <main class="main-content">
      <!-- Hero 区域 -->
      <header class="hero-area">
        <section class="hero-section">
          <div class="glitch-wrapper">
            <!-- 修改此处，使logo文字在主题切换时保持不变 -->
            <h1 class="miku-title" data-text="STARRY MIKU">STARRY MIKU</h1>
          </div>
          <div class="hero-desc">
            <p class="subtitle">连接 <span class="highlight">01</span> 与星辰的数字回响</p>
            <div class="status-indicator"><span class="dot"></span> SYSTEM: {{ isDark ? "NIGHT_MODE" : "DAY_MODE" }}</div>
          </div>
        </section>
      </header>

      <!-- 核心导航网格 -->
      <section class="grid-container">
        <div class="grid-system">
          <div
            v-for="node in nodes"
            :key="node.id"
            class="node-card"
            :class="{ active: activeNode === node.id, inactive: activeNode !== null && activeNode !== node.id }"
            @click="handleNodeClick(node.id)"
          >
            <div class="node-header">
              <span class="node-id">0{{ node.id }}</span>
              <span class="node-icon">{{ node.icon }}</span>
            </div>
            <h2 class="node-title">{{ node.title }}</h2>
            <p class="node-subtitle">{{ node.subtitle }}</p>

            <div class="node-content" v-if="activeNode === node.id">
              <div class="separator"></div>
              <p>{{ node.desc }}</p>
              <button class="dive-btn">DIVE IN -></button>
            </div>
          </div>
        </div>
      </section>

      <!-- 新增内容区域：滑动查看 -->
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

      <footer class="footer">
        <div class="coordinate">COORD: {{ Math.round(mouse.x) }}, {{ Math.round(mouse.y) }}</div>
        <div class="copyright">© 2024 PROJECT 39 | POWERED BY NUXT 3</div>
      </footer>
    </main>
  </div>
</template>

<style>
/* 全局重置 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止横向滚动 */
}

/* CSS 变量定义 - 核心主题控制 */
.app-root {
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
.app-root {
  font-family: "Inter", sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  /* 关键：这里不再使用 transition background，而是依靠 anime.js 的遮罩层实现切换，
     这样性能更好且不会有闪烁 */
}

/* 背景层固定 */
.bg-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.bg-canvas {
  width: 100%;
  height: 100%;
}

.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* 菜单按钮 */
.menu-toggle-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  /* border: 1px solid var(--primary); */
  /* background: var(--toggle-bg); */
  background-color: #ffffff00;
  border: none;
  /* color: var(--text-color); */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* backdrop-filter: blur(5px); */
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.menu-toggle-btn:hover {
  transform: scale(1.1);
  /* background-color: var(--primary); */
  color: #fff;
  background-color: #ffffff00;
}

/* 汉堡图标 */
.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-color);
  margin: 5px 0;
  transition: 0.3s;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
}

/* 菜单栏 */
.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: var(--bg-color); 修改为毛玻璃效果 */
  background: rgba(5, 7, 10, 0.8);
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
.dark-mode .menu-bar {
  background: rgba(5, 7, 10, 0.8);
}

.light-mode .menu-bar {
  background: rgba(240, 242, 245, 0.8);
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

/* 主题切换按钮 */
.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  /* border: 1px solid var(--primary); */
  border: none;
  /* background: var(--toggle-bg); */
  /* color: var(--text-color); */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* backdrop-filter: blur(5px); */
  transition: transform 0.3s ease;
  background-color: #ffffff00;
  font-size: 1.2rem;
}

.theme-toggle-btn:hover {
  transform: rotate(15deg) scale(1.1);
  color: #fff;
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

/* Hero Section */
.hero-section {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 4rem;
}

.miku-title {
  font-family: "Rajdhani", sans-serif;
  font-size: clamp(3rem, 8vw, 6rem); /* 响应式字体 */
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: 0;
  color: var(--text-color);
  position: relative;
  transition: color 0.3s;
}

/* Glitch 效果 */
.glitch-wrapper {
  position: relative;
}
.miku-title::before,
.miku-title::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
}
.miku-title::before {
  left: 2px;
  text-shadow: -1px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}
.miku-title::after {
  left: -2px;
  text-shadow: -1px 0 #39c5bb;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-dim);
  margin-top: 1rem;
  letter-spacing: 0.1em;
}

.highlight {
  color: var(--primary);
  font-weight: bold;
}

.status-indicator {
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border: 1px solid rgba(57, 197, 187, 0.3);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--primary);
  background: rgba(57, 197, 187, 0.05);
  font-family: monospace;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--primary);
  animation: pulse 2s infinite;
}

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

.node-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-color);
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border-radius: 4px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.node-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(57, 197, 187, 0.1);
}

.node-card.active {
  grid-column: span 2;
  border-color: var(--primary);
  background: var(--bg-color); /* 激活时加深背景 */
  box-shadow: 0 0 20px rgba(57, 197, 187, 0.15);
  z-index: 20;
}

.node-card.inactive {
  opacity: 0.5;
  filter: grayscale(80%);
}

.node-header {
  display: flex;
  justify-content: space-between;
  color: var(--text-dim);
  margin-bottom: 1rem;
  font-family: monospace;
}

.node-title {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}
.node-subtitle {
  font-size: 0.9rem;
  color: var(--text-dim);
  margin: 0.5rem 0 0 0;
}

.node-content {
  margin-top: 1rem;
  overflow: hidden;
}
.separator {
  height: 1px;
  width: 50px;
  background: var(--primary);
  margin: 1rem 0;
}

.dive-btn {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 8px 20px;
  cursor: pointer;
  margin-top: 1rem;
  font-family: "Rajdhani", sans-serif;
  text-transform: uppercase;
  transition: all 0.3s;
}

.dive-btn:hover {
  background: var(--primary);
  color: #fff;
}

/* 新增内容列表区域 */
.content-section {
  padding-bottom: 4rem;
}

.section-header {
  margin-bottom: 2rem;
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
  opacity: 0; /* 初始隐藏，滚动触发 */
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
  opacity: 0; /* 初始隐藏 */
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

/* Footer */
.footer {
  padding: 2rem 0 4rem;
  border-top: 1px solid var(--card-border);
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--text-dim);
}

/* 动画关键帧 */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
@keyframes glitch-anim {
  0% {
    clip: rect(14px, 9999px, 12px, 0);
    transform: skew(0.5deg);
  }
  5% {
    clip: rect(50px, 9999px, 80px, 0);
    transform: skew(2deg);
  }
  10% {
    clip: rect(90px, 9999px, 10px, 0);
    transform: skew(-1deg);
  }
  15% {
    clip: rect(20px, 9999px, 100px, 0);
    transform: skew(0.5deg);
  }
  100% {
    clip: rect(0, 9999px, 0, 0);
    transform: skew(0);
  }
}
@keyframes glitch-anim2 {
  0% {
    clip: rect(60px, 9999px, 10px, 0);
    transform: skew(2deg);
  }
  5% {
    clip: rect(10px, 9999px, 50px, 0);
    transform: skew(-1deg);
  }
  10% {
    clip: rect(80px, 9999px, 40px, 0);
    transform: skew(1deg);
  }
  15% {
    clip: rect(30px, 9999px, 90px, 0);
    transform: skew(-1deg);
  }
  100% {
    clip: rect(0, 9999px, 0, 0);
    transform: skew(0);
  }
}

/* --- 移动端适配 (响应式) --- */
@media (max-width: 1024px) {
  .grid-system {
    grid-template-columns: repeat(2, 1fr);
  }
  .node-card.active {
    grid-column: span 2;
  }

  .menu-item a {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding-top: 2rem;
    min-height: 50vh;
  }

  .grid-system {
    grid-template-columns: 1fr; /* 手机单列 */
    gap: 1rem;
  }

  .node-card.active {
    grid-column: span 1; /* 手机上激活也不跨列，只是展开高度 */
  }

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

  .footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .menu-item {
    margin: 1.5rem 0;
  }

  .menu-item a {
    font-size: 1.2rem;
  }
}
</style>
