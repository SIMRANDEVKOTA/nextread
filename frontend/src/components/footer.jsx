//this is for footer component, it is used in App.jsx and it is a common component that 
// is used in all pages. It contains the logo, description, social media links, quick links and community links.
//  It also contains the copyright and legal links.
import React from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-side">
            <div className="footer-logo">
              <FaBookOpen className="brand-icon" />
              <h3>NextRead</h3>
            </div>
            <p className="footer-desc">
              Your personal sanctuary for book discoveries. Connecting readers through genuine recommendations.
            </p>
            <div className="footer-social">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-link-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/recommend">Discover</Link></li>
            </ul>
          </div>

          <div className="footer-link-section">
            <h4>Community</h4>
            <ul>
              <li><Link to="/library">My Library</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/register">Join Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NextRead. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;