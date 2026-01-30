import React from "react";
import { Link } from "react-router-dom";
// ✅ REMOVED: import bookImage from "../../assets/images/book.jpg";
import "../../css/home.css";
import { FaBookOpen, FaMagic } from "react-icons/fa";

const Home = ({ isLoggedIn }) => {
  // ✅ FIXED: Using the backend URL instead of a local asset import
  const bookImageUrl = "http://localhost:6060/images/book.jpg";

  return (
    <main className="home">
      <section
        className="hero"
        style={{
          // ✅ FIXED: Using the variable for the background image
          backgroundImage: `url(${bookImageUrl})`,
          backgroundColor: "#1a1a1a", 
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            
            <div className="hero-tag">
              <FaMagic style={{ color: "#f4a300" }} /> 
              Discover Your Next Favorite Book
            </div>

            <h1 className="hero-title">
              Where Top Reads 
              <span className="highlight"> Meet Trusted Reviews</span>
            </h1>

            <p className="hero-subtitle">
              Join thousands of readers discovering their perfect next read through 
              personalized recommendations and authentic, community-driven reviews.
            </p>

            <div className="hero-search">
              <input type="text" placeholder="Search for books, authors..." />
              <button className="btn-search">Search</button>
            </div>

            <div className="hero-actions">
              {isLoggedIn ? (
                <>
                  <Link to="/library" className="btn-hero-primary">
                    <FaBookOpen /> Go to My Library
                  </Link>
                  <Link to="/recommend" className="btn-hero-secondary">
                    View Recommendations
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-hero-primary">
                    <FaBookOpen /> Start Exploring
                  </Link>
                  <Link to="/register" className="btn-hero-secondary">
                    Create Account
                  </Link>
                </>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Books</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">120K+</span>
                <span className="stat-label">Readers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Reviews</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;