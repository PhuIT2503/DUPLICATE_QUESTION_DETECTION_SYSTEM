import { useState, useEffect } from "react";
import api from "../api/axiosapi";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      api
        .get("/users/me")
        .then((res) => {
          const userData = res.data;
          setUser({
            ...userData,
            fullName: `${userData.firstName} ${userData.lastName}`,
            roles: [userData.role],
            role: userData.role,
          });
        })
        .catch((err) => {
          console.error("Token không hợp lệ:", err);
          localStorage.removeItem("token");
        });
    }
  }, [user]);

  return {
    user,
    handleLogin,
    handleLogout,
  };
};
