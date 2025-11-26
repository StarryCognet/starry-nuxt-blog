// 获取博客文章列表
export default defineEventHandler(async (event) => {
  // 模拟数据库中的文章数据
  const posts = [
    {
      id: 1,
      title: "Nuxt 4入门指南",
      content: "这是一篇关于Nuxt 4的入门文章，介绍了Nuxt 4的基本特性和使用方法。",
      author: "Starry Miku",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Vue 3组合式API深入理解",
      content: "本文深入探讨了Vue 3组合式API的设计理念和最佳实践。",
      author: "Starry Miku",
      createdAt: new Date(Date.now() - 86400000).toISOString() // 前一天
    },
    {
      id: 3,
      title: "前端性能优化技巧",
      content: "分享一些实用的前端性能优化技巧，帮助你构建更快速的Web应用。",
      author: "Starry Miku",
      createdAt: new Date(Date.now() - 172800000).toISOString() // 前两天
    }
  ];

  // 返回JSON数据
  return {
    success: true,
    data: posts,
    message: "获取文章列表成功"
  };
});