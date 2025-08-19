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
};

export default authApi;