import { createContext, useContext } from "react";

// 1. Create the Context object
export const AuthContext = createContext();

// 2. Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};