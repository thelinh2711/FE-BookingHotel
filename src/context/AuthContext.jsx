import React, { createContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy user info từ token
  const fetchUser = async () => {
    try {
      const data = await authApi.getInfo();
      if (data) setUser(data);
    } catch (err) {
      console.error("❌ Get user info failed:", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // Hàm logout
  const logout = async () => {
    await authApi.logout(); 
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
