<script setup lang="ts">
// 这是Nuxt应用的根组件
// 所有页面都会在这里渲染
// 我们需要使用<NuxtLayout>来启用布局系统
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* 全局重置 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止横向滚动 */
}
</style>
