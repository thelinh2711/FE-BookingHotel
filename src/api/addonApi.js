// src/api/addonApi.js
import api from "./api";

const addonApi = {
  // Lấy tất cả addons
  getAll: () => api.get("/api/addons").then(r => r.data),
  
  // Lấy addon theo ID
  getById: (id) => api.get(`/api/addons/${id}`).then(r => r.data),
  
  // Tạo addon mới (admin only)
  create: (data) => api.post("/api/addons", data).then(r => r.data),
  
  // Cập nhật addon (admin only)
  update: (id, data) => api.put(`/api/addons/${id}`, data).then(r => r.data),
  
  // Xóa addon (admin only)
  delete: (id) => api.delete(`/api/addons/${id}`).then(r => r.data),
};

export default addonApi;