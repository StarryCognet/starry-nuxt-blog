// 获取单个博客文章详情
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  // 获取URL参数中的id
  const params = event.context.params || {};
  const id = params.id as string;
  const postId = Number(id);
  
  // 模拟数据库查询
  // 这里可以替换为实际的数据库查询逻辑
  const posts = [
    {
      id: 1,
      title: "Nuxt 4入门指南",
      content: "这是一篇关于Nuxt 4的入门文章，介绍了Nuxt 4的基本特性和使用方法。\n\nNuxt 4带来了许多令人兴奋的新特性，包括改进的服务器组件支持、更快的开发体验和更强大的性能优化功能。\n\n在本教程中，我们将学习如何搭建一个基本的Nuxt 4项目，以及如何利用其核心功能构建现代化的Web应用。",
      author: "Starry Miku",
      createdAt: new Date().toISOString(),
      tags: ["Nuxt", "Vue", "前端开发"]
    },
    {
      id: 2,
      title: "Vue 3组合式API深入理解",
      content: "本文深入探讨了Vue 3组合式API的设计理念和最佳实践。\n\n组合式API是Vue 3中引入的一种新的API风格，它允许我们以更灵活、更可复用的方式组织组件逻辑。\n\n通过本文的学习，你将了解如何使用ref、reactive、computed等核心API构建复杂的组件。",
      author: "Starry Miku",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 前一天
      tags: ["Vue", "组合式API", "JavaScript"]
    },
    {
      id: 3,
      title: "前端性能优化技巧",
      content: "分享一些实用的前端性能优化技巧，帮助你构建更快速的Web应用。\n\n性能优化是前端开发中非常重要的一个方面，它直接影响用户体验和业务转化率。\n\n本文将从资源加载、渲染性能、运行时优化等多个方面，为你介绍前端性能优化的最佳实践。",
      author: "Starry Miku",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 前两天
      tags: ["性能优化", "Web开发", "用户体验"]
    }
  ];
  
  // 查找对应的文章
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    // 如果没有找到文章，返回错误信息
    throw createError({
      statusCode: 404,
      statusMessage: 'Article Not Found',
      message: `ID为${id}的文章不存在`
    });
  }
  
  // 返回找到的文章
  return {
    success: true,
    data: post,
    message: "获取文章详情成功"
  };
});