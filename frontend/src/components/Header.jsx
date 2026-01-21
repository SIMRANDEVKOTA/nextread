
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import logoIcon from '../assets/images/logo-icon.png'; // Add your logo icon here

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logoIcon} alt="Logo" className="logo-icon" />
        <span className="logo-text">Next Read</span>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/recommend">Recommended</Link></li>
          <li><Link to="/library">My Library</Link></li>
          <li><Link to="/profile">My Profile</Link></li>
        </ul>
      </nav>
      <div className="header-right">
        <i className="search-icon">🔍</i>
        <Link to="/signin" className="btn-signin">Sign In</Link>
      </div>
    </header>
  );
};

export default Header;
