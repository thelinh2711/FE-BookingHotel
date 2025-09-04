// src/api/userApi.js
import api from "./api";

const userApi = {
  // User registration (existing)
  register: async (data) => {
    const response = await api.post("/api/users", data);
    return response.data;
  },

  // Get all users (for admin)
  getAllUsers: async () => {
    const response = await api.get("/api/users");
    return response.data;
  },

  // Get user detail by ID
  getUserDetail: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // Create new user (admin function)
  createUser: async (userData) => {
    const response = await api.post("/api/users", userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/api/users/profile");
    return response.data;
  },

  // Update current user profile
  updateProfile: async (userData) => {
    const response = await api.put("/api/users/profile", userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/api/users/change-password", passwordData);
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const response = await api.get(`/api/users?role=${role}`);
    return response.data;
  },

  // Search users
  searchUsers: async (searchTerm) => {
    const response = await api.get(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
};

export default userApi;
