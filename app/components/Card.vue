<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <div v-if="count !== undefined">
      <p>Count value: {{ count }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  content: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: undefined
})
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: white;
}
</style>