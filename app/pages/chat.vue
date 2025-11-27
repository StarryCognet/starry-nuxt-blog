<template>
  <div class="chat-app">
    <!-- 顶部导航 -->
    <header class="chat-header">
      <h1 class="chat-title">
        <span class="title-icon">💬</span>
        实时聊天
      </h1>
      <div class="header-info">
        <span class="message-count">{{ messages.length }} 条消息</span>
        <button class="refresh-btn" @click="fetchMessages" title="刷新消息">🔄</button>
      </div>
    </header>

    <!-- 消息列表 -->
    <main class="chat-main" ref="chatMainRef">
      <div class="messages-container" ref="messagesContainerRef">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-item"
          :class="{ 'is-visible': visibleMessages.has(message.id) }"
          @mouseenter="showActions(message.id)"
          @mouseleave="hideActions(message.id)"
          :ref="(el) => (messageRefs[message.id] = el)"
        >
          <!-- 消息气泡 -->
          <div class="message-bubble">
            <div class="message-header">
              <span class="user-name">{{ message.user }}</span>
              <span class="message-time">{{ formatTime(message.created_at) }}</span>
            </div>
            <div class="message-content">{{ message.msg }}</div>
          </div>

          <!-- 消息操作按钮 -->
          <div class="message-actions" :ref="(el) => (actionsRefs[message.id] = el)">
            <button class="action-btn like-btn" @click="handleLike(message.id)" :class="{ 'is-active': message.isLiked }" title="点赞">
              <span class="action-icon">❤️</span>
              <span class="action-count">{{ message.likes }}</span>
            </button>
            <button class="action-btn delete-btn" @click="handleDelete(message.id)" title="删除">
              <span class="action-icon">🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部输入区域 -->
    <footer class="chat-footer">
      <form class="message-form" @submit.prevent="sendMessage">
        <div class="form-group">
          <input type="text" v-model="formData.user" placeholder="你的昵称" class="input-user" required maxlength="20" />
        </div>
        <div class="form-group">
          <textarea v-model="formData.message" placeholder="输入消息..." class="input-message" rows="2" required maxlength="500" @input="autoResizeTextarea"></textarea>
        </div>
        <button type="submit" class="send-button" :disabled="isSending">
          <span v-if="isSending">发送中...</span>
          <span v-else>发送消息</span>
        </button>
      </form>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { getMsg, addMsg, likeMsg, delMsg } from "../../utils/api";
import gsap from "gsap";

// 消息列表
const messages = ref([]);
// 表单数据
const formData = ref({
  user: "",
  message: "",
});
// 加载状态
const isSending = ref(false);
// 定时器
let refreshInterval = null;

// DOM引用
const chatMainRef = ref(null);
const messagesContainerRef = ref(null);
const messageRefs = ref({});
const actionsRefs = ref({});

// 可见消息集合
const visibleMessages = ref(new Set());

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 获取消息列表
const fetchMessages = async () => {
  try {
    const data = await getMsg();
    messages.value = data;
    await nextTick();
    checkVisibleMessages();
  } catch (error) {
    console.error("获取消息失败:", error);
    showNotification("获取消息失败，请稍后重试", "error");
  }
};

// 发送消息
const sendMessage = async () => {
  if (!formData.value.user.trim() || !formData.value.message.trim()) return;

  isSending.value = true;

  try {
    const messageData = {
      user: formData.value.user.trim(),
      msg: formData.value.message.trim(),
      likes: 0,
      created_at: Math.floor(Date.now() / 1000),
    };

    await addMsg(messageData);

    // 清空消息输入框
    formData.value.message = "";
    autoResizeTextarea();

    // 重新获取消息
    await fetchMessages();

    // 滚动到底部
    scrollToBottom();

    showNotification("消息发送成功", "success");
  } catch (error) {
    console.error("发送消息失败:", error);
    showNotification("发送消息失败，请稍后重试", "error");
  } finally {
    isSending.value = false;
  }
};

// 点赞消息
const handleLike = async (id) => {
  try {
    await likeMsg(id);
    // 重新获取消息
    await fetchMessages();

    // 点赞动画
    const messageEl = messageRefs.value[id];
    if (messageEl) {
      gsap.to(messageEl, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
  } catch (error) {
    console.error("点赞失败:", error);
    showNotification("点赞失败，请稍后重试", "error");
  }
};

// 删除消息
const handleDelete = async (id) => {
  try {
    // 删除动画
    const messageEl = messageRefs.value[id];
    if (messageEl) {
      gsap.to(messageEl, {
        opacity: 0,
        height: 0,
        marginBottom: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: async () => {
          await delMsg(id);
          await fetchMessages();
        },
      });
    }
  } catch (error) {
    console.error("删除消息失败:", error);
    showNotification("删除消息失败，请稍后重试", "error");
  }
};

// 显示操作按钮
const showActions = (id) => {
  const actionsEl = actionsRefs.value[id];
  if (actionsEl) {
    gsap.fromTo(
      actionsEl,
      {
        opacity: 0,
        y: 10,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "back.out(1.7)",
        duration: 0.3,
      }
    );
  }
};

// 隐藏操作按钮
const hideActions = (id) => {
  const actionsEl = actionsRefs.value[id];
  if (actionsEl) {
    gsap.to(actionsEl, {
      opacity: 0,
      y: 10,
      scale: 0.8,
      ease: "back.in(1.7)",
      duration: 0.2,
    });
  }
};

// 检查元素是否在视口中
const isElementInViewport = (el) => {
  if (!el || !chatMainRef.value) return false;

  const rect = el.getBoundingClientRect();
  const containerRect = chatMainRef.value.getBoundingClientRect();

  return rect.top <= containerRect.bottom + 100 && rect.bottom >= containerRect.top - 100;
};

// 检查可见消息并添加动画
const checkVisibleMessages = () => {
  Object.entries(messageRefs.value).forEach(([id, el]) => {
    if (el && isElementInViewport(el) && !visibleMessages.value.has(id)) {
      visibleMessages.value.add(id);

      // 入场动画
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x: -30,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          ease: "power3.out",
          duration: 0.5,
          delay: Math.random() * 0.15,
        }
      );
    }
  });
};

// 滚动到底部
const scrollToBottom = () => {
  if (chatMainRef.value) {
    gsap.to(chatMainRef.value, {
      scrollTop: chatMainRef.value.scrollHeight,
      duration: 0.5,
      ease: "power2.out",
    });
  }
};

// 自动调整文本域高度
const autoResizeTextarea = () => {
  const textarea = document.querySelector(".input-message");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }
};

// 显示通知
const showNotification = (message, type = "info") => {
  // 创建通知元素
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // 添加到页面
  document.body.appendChild(notification);

  // 动画显示
  gsap.fromTo(
    notification,
    {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    }
  );

  // 自动隐藏
  setTimeout(() => {
    gsap.to(notification, {
      opacity: 0,
      y: -50,
      scale: 0.9,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: () => {
        document.body.removeChild(notification);
      },
    });
  }, 3000);
};

// 滚动事件监听
const handleScroll = () => {
  checkVisibleMessages();
};

// 初始化
onMounted(() => {
  // 获取初始消息
  fetchMessages();

  // 设置自动刷新
  refreshInterval = setInterval(fetchMessages, 5000);

  // 添加滚动监听
  if (chatMainRef.value) {
    chatMainRef.value.addEventListener("scroll", handleScroll);
  }

  // 初始检查可见消息
  nextTick(() => {
    checkVisibleMessages();
    scrollToBottom();
  });
});

// 清理
onUnmounted(() => {
  // 清除定时器
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  // 移除滚动监听
  if (chatMainRef.value) {
    chatMainRef.value.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  display: flex;
  flex-direction: column;
  color: #333;
}

/* 顶部导航 */
.chat-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.chat-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.8rem;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.message-count {
  font-size: 0.9rem;
  color: #666;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: #666;
}

.refresh-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: rotate(180deg);
}

/* 主内容区域 */
.chat-main {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem;
  scroll-behavior: smooth;
}

.messages-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 消息项 */
.message-item {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.3s ease;
}

.message-item.is-visible {
  opacity: 1;
  transform: translateX(0);
}

/* 消息气泡 */
.message-bubble {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.message-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-name {
  font-weight: 600;
  color: #667eea;
  font-size: 0.95rem;
}

.message-time {
  font-size: 0.8rem;
  color: #999;
}

.message-content {
  color: #333;
  line-height: 1.6;
  font-size: 1rem;
  word-wrap: break-word;
}

/* 消息操作按钮 */
.message-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  gap: 0.25rem;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: scale(0.95);
}

.like-btn {
  color: #ff6b6b;
}

.like-btn.is-active {
  background: rgba(255, 107, 107, 0.1);
}

.delete-btn {
  color: #95a5a6;
}

.delete-btn:hover {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.action-icon {
  font-size: 0.9rem;
}

.action-count {
  font-size: 0.8rem;
  font-weight: 600;
}

/* 底部输入区域 */
.chat-footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.message-form {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-user,
.input-message {
  padding: 0.8rem 1.2rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  outline: none;
}

.input-user:focus,
.input-message:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-message {
  resize: none;
  min-height: 60px;
  max-height: 120px;
}

.send-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
}

.send-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* 通知样式 */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.notification-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.notification-error {
  background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
}

.notification-info {
  background: linear-gradient(135deg, #3498db 0%, #9b59b6 100%);
}

/* 滚动条样式 */
.chat-main::-webkit-scrollbar {
  width: 8px;
}

.chat-main::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.chat-main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.chat-main::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 1rem;
  }

  .chat-main {
    padding: 1rem;
  }

  .chat-footer {
    padding: 1rem;
  }

  .chat-title {
    font-size: 1.2rem;
  }

  .message-bubble {
    max-width: 85%;
  }
}
</style>
