<template>
  <div class="bg-layer">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>
    <div class="noise-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDark = defineModel<boolean>('isDark', { required: true });
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;
let particles: Particle[] = [];
const mouse = reactive({ x: -1000, y: -1000 });

// Miku 主题色配置
const COLORS = {
  primary: "#39C5BB", // Miku Teal
  secondary: "#E6006F", // Magenta accent
  darkBg: "#05070a",
  lightBg: "#f0f2f5",
  darkText: "#ffffff",
  lightText: "#1a1d23",
};

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

// 定义要暴露给父组件的方法
defineExpose({
  initCanvas,
  runAnimationLoop,
  stopAnimation: () => {
    cancelAnimationFrame(animationFrameId);
  },
  updateParticlesColor: () => {
    particles.forEach((p) => p.setColor());
  },
  setMousePosition: (x: number, y: number) => {
    mouse.x = x;
    mouse.y = y;
  }
});

onMounted(() => {
  initCanvas();
  runAnimationLoop();

  window.addEventListener("resize", initCanvas);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", initCanvas);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
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
</style>