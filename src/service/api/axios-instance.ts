import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: '/api', // Gọi API nội bộ của Next.js
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor thêm token từ NextAuth
axiosInstance.interceptors.request.use(async (config) => {
  const session = (await getSession()) as any;
  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return config;
});

// Xử lý lỗi API
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response || error.message)
);

export default axiosInstance;
