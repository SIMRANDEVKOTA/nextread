import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schema/login.schema";
import authService from "../../services/authService";
import { AuthContext } from "../../context/AuthContext"; 
import { useNavigate, Link } from "react-router-dom";
import "../../css/auth.css";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaBookOpen, FaTimes } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      console.log("🔵 Submitting Login Data:", data); 

      const res = await authService.login(data);
      console.log("🟢 Backend Response:", res); 

      if (res.token && res.user) {
        // ✅ LOGGING ROLE FOR DEBUGGING
        console.log("✅ User Role from DB:", res.user.role); 
        
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        login(res.user, res.token);

        // ✅ REDIRECTION LOGIC
        if (res.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.warn("⚠️ Token MISSING in response.");
        setServerError("Login successful, but no token received.");
      }
    } catch (err) {
      console.error("🔴 Login Error:", err);
      setServerError(err.response?.data?.message || "Invalid email or password");
    }
  };

  const errorStyle = { color: "#d32f2f", fontSize: "0.8rem", marginTop: "5px", display: "block" };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <Link to="/" className="close-btn"><FaTimes /></Link>

        <div className="logo-section">
          <div className="logo-icon"><FaBookOpen /></div>
          <span className="logo-text">NextRead</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue your reading journey</p>

          {serverError && <div className="error-alert">{serverError}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input type="email" {...register("email")} />
            </div>
            {errors.email && <span style={errorStyle}>{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input type={showPassword ? "text" : "password"} {...register("password")} />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span style={errorStyle}>{errors.password.message}</span>}
            <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <div className="auth-switch">
            <span>Don't have an account?</span>
            <Link to="/register">Create one now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;