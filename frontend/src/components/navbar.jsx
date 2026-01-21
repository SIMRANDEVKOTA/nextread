import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { FaBookOpen, FaBars, FaTimes } from "react-icons/fa"; 
import "../css/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/"); // Redirect to Explore/Home after logout
  };

  return (
    <nav className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="logo">
        <div className="logo-icon-box">
          <FaBookOpen />
        </div>
        <span className="logo-text">Next Read</span>
      </Link>

      <button className="nav-hamburger" onClick={handleMenuToggle} aria-label="Toggle menu">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          // --- LOGGED IN VIEW ---
          <>
            <li><NavLink to="/dashboard" onClick={closeMenu} className="nav-item">Home</NavLink></li>
            <li><NavLink to="/recommend" onClick={closeMenu} className="nav-item">Recommended</NavLink></li>
            <li><NavLink to="/library" onClick={closeMenu} className="nav-item">My Library</NavLink></li>
            <li><NavLink to="/profile" onClick={closeMenu} className="nav-item">My Profile</NavLink></li>
            <li className="nav-mobile-action">
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          // --- GUEST VIEW (Before Login) ---
          <>
            <li><NavLink to="/" onClick={closeMenu} className="nav-item">Explore</NavLink></li>
            <li><NavLink to="/about" onClick={closeMenu} className="nav-item">About Us</NavLink></li>
            <li><NavLink to="/contact" onClick={closeMenu} className="nav-item">Contact Us</NavLink></li>
            <li className="nav-mobile-action">
              <Link to="/login" className="nav-btn" onClick={closeMenu}>Sign In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;