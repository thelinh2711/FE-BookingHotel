import api from "./api";

const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data?.result?.token) {
      localStorage.setItem("token", response.data.result.token);
    }
    return response.data;
  },

  // Lấy thông tin user từ token
  getInfo: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await api.get("api/users/info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Login bằng Google
  getGoogleLoginUrl: async () => {
    const response = await api.get("/auth/google/url");
    return response.data;
  },

  googleLogin: async (code) => {
    const response = await api.post("/auth/google", { code });
    return response.data; // { token, refreshToken, authenticated }
  },
};

export default authApi;
