<template>
  <div 
    class="node-card"
    :class="{ active: isActive, inactive: !isActive && activeNodeId !== null }"
    @click="$emit('select', node.id)"
  >
    <div class="node-header">
      <span class="node-id">0{{ node.id }}</span>
      <span class="node-icon">{{ node.icon }}</span>
    </div>
    <h2 class="node-title">{{ node.title }}</h2>
    <p class="node-subtitle">{{ node.subtitle }}</p>

    <div class="node-content" v-if="isActive">
      <div class="separator"></div>
      <p>{{ node.desc }}</p>
      <button class="dive-btn">DIVE IN -></button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Node {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
}

defineProps<{
  node: Node;
  isActive: boolean;
  activeNodeId: number | null;
}>();

defineEmits<{
  (e: 'select', id: number): void;
}>();
</script>

<style scoped>
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
  border-radius: 25px;
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
  background: var(--bg-color);
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

/* --- 移动端适配 (响应式) --- */
@media (max-width: 1024px) {
  .node-card.active {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .node-card.active {
    grid-column: span 1;
  }
}
</style>