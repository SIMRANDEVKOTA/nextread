import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { AuthProvider } from "./context/AuthProvider"; 
import { LibraryProvider } from "./context/LibraryProvider"; 
import { ToastProvider } from "./context/ToastContext"; 
import PrivateRoute from "./routes/privateRoute";

// Pages
import Home from "./pages/public/home";
import Login from "./pages/public/login";
import Register from "./pages/public/register";
import AboutUs from "./pages/public/aboutus"; // ✅ FIXED: Lowercase to match file system
import ContactUs from "./pages/public/ContactUs";
import Dashboard from "./pages/private/dashboard"; 
import Recommend from "./pages/private/recommend";
import Library from "./pages/private/library"; 
import Profile from "./pages/private/profile";
import Reviews from "./pages/private/reviews";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LibraryProvider>
          <Router>
            <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />

                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/recommend" element={<PrivateRoute><Recommend /></PrivateRoute>} />
                  <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/reviews/:id" element={<PrivateRoute><Reviews /></PrivateRoute>} />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LibraryProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;