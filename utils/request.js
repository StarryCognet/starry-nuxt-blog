import axios from "axios";

// ① 实例
const instance = axios.create({
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || "https://apis.starrycognition.cn",
  timeout: 15000, // 增加到15秒
  headers: {
    'Content-Type': 'application/json',
  }
});

// ② 请求拦截器（添加token）
instance.interceptors.request.use(
  (config) => {
    // 添加调试日志
    console.log('发送请求:', config);
    
    // 不需要认证的接口列表（白名单）
    const noAuthEndpoints = [
      '/api/auth/login', 
      '/api/auth/register', 
      '/api/login/code', 
      '/api/login/verify', 
      '/api/auth/forgot-password', 
      '/api/auth/reset-password',
      '/api/auth/refresh',
      '/api/messages'
    ];
    const shouldAddAuth = !noAuthEndpoints.some(endpoint => config.url.includes(endpoint));
    
    // 在Nuxt中，token通常存储在cookies或useState中
    // 这里简化处理，暂时不添加token
    
    return config;
  },
  (error) => {
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// ③ 响应拦截（处理401错误和token刷新，并统一OpenAPI响应格式）
instance.interceptors.response.use(
  (res) => {
    console.log('收到响应:', res);

    // 假设后端遵循类似 { code: 200, data: {}, msg: "" } 的格式（常见于OpenAPI项目）
    const responseData = res.data;

    // 可在此处统一判断 code === 200 或 success: true
    if (
      (responseData.code !== undefined && ![200, 201].includes(responseData.code)) ||
      (responseData.success !== undefined && !responseData.success)
    ) {
      const errorMessage = responseData.msg || responseData.message || '请求失败';
      
      // 在Nuxt中，使用useToast或其他方式显示错误
      console.error('请求失败:', errorMessage);
      
      return Promise.reject(new Error(errorMessage));
    }

    // 成功则返回 data 字段内容（符合OpenAPI解构习惯）
    return responseData.data ?? responseData;
  },
  async (err) => {
    console.error('响应错误:', err);
    
    // 统一错误处理
    let errorMessage = '';
    if (err.response) {
      const { status, data } = err.response;
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误';
          break;
        case 403:
          errorMessage = '权限不足';
          break;
        case 404:
          errorMessage = '请求资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = data?.message || `请求失败(${status})`;
      }
      console.error(`API ${status}:`, data);
    } else if (err.request) {
      if (err.message && (err.message.includes('CORS') || err.message.includes('cors'))) {
        errorMessage = "跨域请求被阻止，请检查网络设置";
      } else if (err.message && err.message.includes('timeout')) {
        errorMessage = "请求超时，请检查网络连接或稍后再试";
      } else {
        errorMessage = "网络连接异常，请检查网络设置或稍后再试";
      }
    } else {
      errorMessage = err.message || "请求错误";
    }

    // 统一返回更详细的错误信息
    return Promise.reject(err.response?.data || { 
      message: errorMessage,
      code: err.response?.status
    });
  }
);

// ③ 通用 CRUD
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);

// ④ 文件上传（单文件 / 多文件 / 带额外字段）
export const upload = (url, fileOrFiles, extra = {}) => {
  const fd = new FormData();
  if (Array.isArray(fileOrFiles)) {
    fileOrFiles.forEach((f) => fd.append("file", f));
  } else {
    fd.append("file", fileOrFiles);
  }
  Object.keys(extra).forEach((k) => fd.append(k, extra[k]));
  return instance.post(url, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (p) => {
      const percent = Math.round((p.loaded / p.total) * 100);
      console.log(`上传进度：${percent}%`); // 可换成 UI 进度条
    },
  });
};

// ⑤ 默认导出（备用）
export default instance;