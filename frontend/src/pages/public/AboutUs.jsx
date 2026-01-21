import React from 'react';
import '../../css/aboutus.css';
import { FaHeart, FaUsers, FaCompass, FaShieldAlt } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-page fade-in">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container centered-layout">
          {/* Badge styled as per Screenshot 10 */}
          <div className="badge-container">
             <span className="badge-icon">✦</span>
             <span className="badge-text">Discover Your Next Adventure</span>
          </div>
          
          <h1 className="hero-title">We Help You Find <br /><span className="text-highlight">Books You'll Love</span></h1>
          
          <div className="hero-description-box">
            <p className="hero-subtitle-muted">
              NextRead is a community-driven platform connecting readers with their 
              perfect books through smart recommendations and passionate curation.
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <h2>2M+</h2>
              <p>Readers</p>
            </div>
            <div className="stat-item">
              <h2>50K</h2>
              <p>Books</p>
            </div>
            <div className="stat-item">
              <h2>180+</h2>
              <p>Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - De-congested as per Screenshots 6 & 11 */}
      <section className="about-story">
        <div className="container centered-layout">
          <span className="upper-label">OUR STORY</span>
          <h2 className="main-section-title">Born from a simple question</h2>
          
          <div className="story-text-container">
            <p className="story-lead">"What should I read next?"</p>
            <p className="story-para">
              We asked ourselves this question countless times, scrolling through endless 
              lists that never quite understood our taste. 
            </p>
            <p className="story-para">
              So we built NextRead: a platform where every recommendation comes from 
              real readers who share your passions. No algorithms pushing bestsellers — 
              just genuine connections between books and the people who love them.
            </p>
            <p className="story-para">
              Today, we're a global community of book lovers discovering stories together, 
              one recommendation at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section - Styled as per Screenshot 9 */}
      <section className="about-values">
        <div className="container centered-layout">
          <span className="upper-label">WHAT WE STAND FOR</span>
          <h2 className="main-section-title">Our Values</h2>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-box orange-tint"><FaHeart /></div>
              <h3>Curated with Care</h3>
              <p>Every book on our platform is recommended by real readers, not pushed by publishers or algorithms.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box blue-tint"><FaUsers /></div>
              <h3>Community Driven</h3>
              <p>Join book clubs, share reviews, and connect with readers who share your literary taste.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box peach-tint"><FaCompass /></div>
              <h3>Discover Fearlessly</h3>
              <p>Step outside your comfort zone with personalized recommendations that expand your horizons.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box green-tint"><FaShieldAlt /></div>
              <h3>Your Data, Protected</h3>
              <p>We never sell your reading data. Your bookshelf is your private sanctuary.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;