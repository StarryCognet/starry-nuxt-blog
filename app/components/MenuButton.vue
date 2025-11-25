<template>
  <button class="menu-toggle-btn" @click="$emit('toggle')" aria-label="Toggle Menu">
    <div class="hamburger" :class="{ open: menuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  menuOpen: boolean
}>();

defineEmits<{
  (e: 'toggle'): void
}>();
</script>

<style scoped>
.menu-toggle-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ffffff00;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.menu-toggle-btn:hover {
  transform: scale(1.1);
  color: #fff;
  background-color: #ffffff00;
}

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
</style>