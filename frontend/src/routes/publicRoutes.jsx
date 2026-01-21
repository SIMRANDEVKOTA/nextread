import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Home from "../pages/public/home";
import Login from "../pages/public/login";
import Register from "../pages/public/register";

export default function PublicRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        {/* Allow both "/" and "/home" to render the Home component */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Route>

      {/* Redirect unknown routes to login (or home if logged in) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}