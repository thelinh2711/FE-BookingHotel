// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // chỉnh nếu BE deploy khác
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Skip Authorization cho login hoặc register
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/google") ||
    config.url.includes("/auth/google/url") ||
    (config.method === "post" && config.url.includes("/api/users"))
  ) {
    delete config.headers.Authorization;
    return config;
  }

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;
