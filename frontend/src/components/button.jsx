
import React from "react";
import "../css/button.css";

const Button = ({ text, type = "button", variant = "primary", onClick }) => {
  return (
    <button
      type={type}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-secondary"}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
