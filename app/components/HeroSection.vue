<template>
  <header class="hero-area">
    <section class="hero-section">
      <div class="glitch-wrapper">
        <h1 class="miku-title" data-text="STARRY MIKU">STARRY MIKU</h1>
      </div>
      <div class="hero-desc">
        <p class="subtitle">连接 <span class="highlight">01</span> 与星辰的数字回响</p>
        <div class="status-indicator"><span class="dot"></span> SYSTEM: {{ isDark ? "NIGHT_MODE" : "DAY_MODE" }}</div>
      </div>
    </section>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  isDark: boolean
}>();
</script>

<style scoped>
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
  font-size: clamp(3rem, 8vw, 6rem);
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
@media (max-width: 768px) {
  .hero-section {
    padding-top: 2rem;
    min-height: 50vh;
  }
}
</style>