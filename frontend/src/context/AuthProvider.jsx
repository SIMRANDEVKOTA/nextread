import React, { useState, useEffect } from "react";
import authService from "../services/authService";
import { AuthContext } from "./AuthContext"; // ✅ Import from the new file

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading] = useState(false);

  // Sync Token and User with LocalStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (userData, tokenData) => {
    setToken(tokenData);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};