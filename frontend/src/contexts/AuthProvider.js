import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import AuthService from "../services/AuthService";
import api from "../api/axiosapi";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Kiểm tra token có hết hạn không
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }
        
        const formattedUser = {
          id: decoded.sub,
          fullName: decoded.fullName || "Không xác định",
          username: decoded.userCode || decoded.username,
          firstName: decoded.firstName || "Không xác định",
          lastName: decoded.lastName || "",
          email: decoded.email || "",
          roles: [decoded.role],
          role: decoded.role,
        };
        
        console.log("Decoded JWT token:", decoded);
        console.log("User loaded from token:", formattedUser);
        setUser(formattedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { 
        userCode: username, 
        password: password 
      });
      
      const data = response.data;
      
      if (data.success && data.token) {
        const decoded = jwtDecode(data.token);
        
        localStorage.setItem("token", data.token);
        
        const formattedUser = {
          id: decoded.sub || Date.now(),
          fullName: decoded.fullName || "Không xác định",
          username: username,
          firstName: decoded.firstName || "Không xác định",
          lastName: decoded.lastName || "",
          email: decoded.email || "",
          roles: [decoded.role],
          role: decoded.role,
        };
        
        console.log("User logged in:", formattedUser);
        setUser(formattedUser);
        return formattedUser;
      } else {
        throw new Error(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
