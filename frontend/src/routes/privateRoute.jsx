import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ While loading auth state, show nothing (prevents flashing)
  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  // ✅ If NOT authenticated, redirect to login with location state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ If authenticated, render the component
  return children;
};

export default PrivateRoute;