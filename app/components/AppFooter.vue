<template>
  <footer class="footer">
    <div class="coordinate">COORD: {{ Math.round(mouseX) }}, {{ Math.round(mouseY) }}</div>
    <div class="copyright">© 2024 PROJECT 39 | POWERED BY NUXT 3</div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  mouseX: number;
  mouseY: number;
}>();
</script>

<style scoped>
.footer {
  padding: 2rem 0 4rem;
  border-top: 1px solid var(--card-border);
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--text-dim);
}

/* --- 移动端适配 (响应式) --- */
@media (max-width: 768px) {
  .footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>