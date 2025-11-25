<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>

<style scoped>
.counter {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  margin: 10px;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>