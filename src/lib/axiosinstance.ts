// lib/axiosInstance.ts

import axios from 'axios';

// Create instance
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem("currentAuth") || localStorage.getItem("currentAuth");

      if (auth) {
        const parsed = JSON.parse(auth);
        const token = parsed?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
