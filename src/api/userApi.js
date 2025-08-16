// src/api/userApi.js
import api from "./api";

const userApi = {
  register: async (data) => {
    return await api.post("/api/users", data);
  },
};

export default userApi;
