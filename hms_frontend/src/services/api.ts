// src/services/api.ts
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';


// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VUE_APP_API_URL || 'http://localhost:2020/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;