// src/api/authApi.js
import api from "./api";

const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    // Lưu token vào localStorage
    if (response.data?.result?.token) {
      localStorage.setItem("token", response.data.result.token);
    }

    return response.data;
  },
};

export default authApi;
