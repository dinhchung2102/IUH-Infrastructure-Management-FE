import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // load từ localStorage khi refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);

      // nếu có user lưu sẵn thì set tạm thời
      if (savedUser) setUser(JSON.parse(savedUser));

      // fetch lại profile từ API để chắc chắn dữ liệu đầy đủ
      fetchUserProfile(savedToken);
    }
  }, []);

const fetchUserProfile = async (access_token) => {
  try {
    const res = await axios.get("/auth/profile", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (res.data && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
  } catch (err) {
    console.error("Failed to fetch user profile", err);
    logout();
  }
};


  const login = (userData, access_token) => {
    setUser(userData);
    setToken(access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", access_token);

    // fetch profile để đảm bảo dữ liệu đầy đủ
    fetchUserProfile(access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
