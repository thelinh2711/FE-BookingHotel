// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Skip Authorization cho login hoặc register
  if (
    config.url.includes("/auth/login") ||
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
