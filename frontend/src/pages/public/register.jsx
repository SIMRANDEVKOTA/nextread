import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schema/register.schema";
import authService from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "../../css/auth.css";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaBookOpen, FaTimes } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setServerError(""); 
    try {
      await authService.register(data);
      alert("Registration successful! Please log in with your new account.");
      navigate("/login"); 
    } catch (err) {
      console.error("Register Error:", err);
      setServerError(err.response?.data?.message || "Registration failed");
    }
  };

  const errorStyle = { color: "#d32f2f", fontSize: "0.8rem", marginTop: "5px", display: "block" };
  // Fixed the padding-left to prevent text overlapping icons
  const inputPaddingStyle = { paddingLeft: "45px" };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <Link to="/" className="close-btn" style={{ textDecoration: 'none' }}><FaTimes /></Link>

        <div className="logo-section">
          <div className="logo-icon"><FaBookOpen /></div>
          <span className="logo-text">NextRead</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Start your reading adventure today</p>

          {serverError && <div className="error-alert">{serverError}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input {...register("fullName")} placeholder="John Doe" style={inputPaddingStyle} />
            </div>
            {errors.fullName && <span style={errorStyle}>{errors.fullName.message}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input {...register("email")} placeholder="you@example.com" style={inputPaddingStyle} />
            </div>
            {errors.email && <span style={errorStyle}>{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                {...register("password")} 
                style={inputPaddingStyle}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {/* Fixed: Show EyeSlash when text is visible, Eye when hidden */}
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span style={errorStyle}>{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                {...register("confirmPassword")} 
                style={inputPaddingStyle}
              />
              <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {/* Fixed: Show EyeSlash when text is visible, Eye when hidden */}
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          <div className="auth-switch">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;