// src/api/authApi.js
import api from "./api";

const authApi = {
  // ĐÚNG: nhận { email, password }
  login: async ({ email, password }) => {
    
    const response = await api.post("/auth/login", { email, password });

    const token = response?.data?.result?.token;
    if (token) localStorage.setItem("token", token);

    return response.data; // { code, result: { token, ... } }
  },

  getInfo: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await api.get("/api/users/info", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getGoogleLoginUrl: async () => {
    const response = await api.get("/auth/google/url");
    return response.data;
  },

  googleLogin: async (code) => {
    const response = await api.post("/auth/google", { code });
    const token = response?.data?.token;
    if (token) {
      localStorage.setItem("token", token);

      // 👉 lấy user info ngay sau khi có token
      const userRes = await api.get("/api/users/info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { token, user: userRes.data }; 
    }

    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken"); // nếu BE có lưu refresh token
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken"); 
    }
  },
};

export default authApi;
