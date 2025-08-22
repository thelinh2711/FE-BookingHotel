import api from "./api";

const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data?.result?.token) {
      localStorage.setItem("token", response.data.result.token);
    }
    return response.data;
  },

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
