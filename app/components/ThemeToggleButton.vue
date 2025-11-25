<template>
  <button ref="themeBtnRef" class="theme-toggle-btn" @click="$emit('toggle')" aria-label="Toggle Theme">
    <div class="icon-container">
      <span v-if="isDark">🌙</span>
      <span v-else>☀️</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const themeBtnRef = ref<HTMLButtonElement | null>(null);

defineProps<{
  isDark: boolean
}>();

defineEmits<{
  (e: 'toggle'): void
}>();

defineExpose({
  themeBtnRef
});
</script>

<style scoped>
.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  background-color: #ffffff00;
  font-size: 1.2rem;
}

.theme-toggle-btn:hover {
  transform: rotate(15deg) scale(1.1);
  color: #fff;
}
</style>