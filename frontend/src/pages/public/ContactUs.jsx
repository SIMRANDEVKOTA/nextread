import React from "react";
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import "../../css/contactus.css"; 

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Professional message handling triggered.");
  };

  return (
    <div className="contact-page fade-in">
      <div className="contact-container">
        <header className="contact-header">
          <span className="contact-badge">Connect With Us</span>
          <h1 className="contact-title-brown">Let's Start a <span className="text-gold">Conversation</span></h1>
          <p className="contact-subtitle">Have questions? Our team is ready to provide the answers you need.</p>
        </header>

        <div className="contact-grid">
          <div className="contact-sidebar">
            <div className="info-card">
              <div className="icon-circle"><FaEnvelope /></div>
              <div>
                <h3>Email Us</h3>
                <p>nextread@gmail.com</p>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-circle"><FaPhone /></div>
              <div>
                <h3>Call Us</h3>
                <p>+977 980-0000000</p>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-circle"><FaMapMarkerAlt /></div>
              <div>
                <h3>Our Library</h3>
                <p>Durbarmarg,Kathmandu,Nepal</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="email@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us how we can help..." rows="6" required></textarea>
            </div>
            <button type="submit" className="contact-submit-btn">
              Send Message <FaPaperPlane className="plane-icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;