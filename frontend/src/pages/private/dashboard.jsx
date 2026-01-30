import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllBooks, addToLibrary, fetchPopularBooks } from "../../services/api"; // ✅ Added fetchPopularBooks
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { FaStar, FaBookmark, FaBookOpen, FaFire } from "react-icons/fa";
import "../../css/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [discoverBooks, setDiscoverBooks] = useState([]); // ✅ Separated Discover
  const [popularBooks, setPopularBooks] = useState([]);   // ✅ Separated Trending
  const [loading, setLoading] = useState(true);
  const [savedBooks, setSavedBooks] = useState(new Set());
  const [selectedBookForRating, setSelectedBookForRating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 1. Fetches only the 5 Pinned Admin books for Trending
        const trendingRes = await fetchPopularBooks();
        setPopularBooks(trendingRes.data);

        // ✅ 2. Fetches the standard Discover catalog
        const catalogRes = await fetchAllBooks();
        setDiscoverBooks(catalogRes.data.slice(0, 4)); // Only show first 4 in Discover
      } catch {
        showToast("Failed to load dashboard content", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const showRatingPopup = (book) => setSelectedBookForRating(book);
  const closeRatingPopup = () => setSelectedBookForRating(null);

  const handleSave = async (book) => {
    if (!user) return showToast("Please login first", "error");
    try {
      await addToLibrary({ bookId: book.id, status: "to-read" });
      setSavedBooks((prev) => new Set([...prev, book.id]));
      showToast("Book saved to library", "success");
    } catch {
      showToast("Failed to save book", "error");
    }
  };

  const handleUnsave = (bookId) => {
    setSavedBooks((prev) => {
      const next = new Set(prev);
      next.delete(bookId);
      return next;
    });
    showToast("Book removed from library", "success");
  };

  const handleRead = async (book) => {
    if (!user) return showToast("Please login first", "error");
    try {
      await addToLibrary({ bookId: book.id, status: "currently-reading" });
      showToast("Started reading!", "success");
      navigate("/library");
    } catch {
      navigate("/library");
    }
  };

  if (loading) return <div className="loader">Loading books...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="sub-tag orange-theme">
          <FaBookOpen className="icon" /> EXPLORE ALL
        </div>
        <h1>Discover Books</h1>
        <p>Explore, save, and review your favorite books from our collection</p>
      </header>

      <div className="dashboard-grid">
        {discoverBooks.map((book) => (
          <div key={book.id} className="book-card-v2">
            <div className="card-top" onClick={() => showRatingPopup(book)}>
              <img 
                src={`http://localhost:6060/images/${book.cover}`} 
                alt={book.title} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:6060/images/default-cover.jpg'; }}
              />
            </div>
            <div className="card-body">
              <span className="genre-label">{book.genre}</span>
              <h3>{book.title}</h3>
              <p className="author-name">by {book.author}</p>
              <div className="rating-row">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(book.rating || 0) ? "star-filled" : "star-empty"} />
                  ))}
                </div>
                <span className="rating-num">{book.rating ? book.rating.toFixed(1) : "0.0"}</span>
              </div>
            </div>
            <div className="card-actions">
              <button className="btn-read-now" onClick={() => handleRead(book)}>Read Now</button>
              <button className="btn-review-card" onClick={() => navigate(`/reviews/${book.id}`)}>Review</button>
              <button className="btn-bookmark" onClick={() => savedBooks.has(book.id) ? handleUnsave(book.id) : handleSave(book)}>
                <FaBookmark color={savedBooks.has(book.id) ? "#8b5e3c" : "#ccc"} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="section-divider-large" />

      <section className="popular-section-full">
        <div className="section-header-centered">
          <span className="trending-label"><FaFire /> TRENDING NOW</span>
          <h2>Most Popular This Week</h2>
          <p>Highest engagement and ratings over the last seven days</p>
        </div>
        
        <div className="popular-display-grid">
          {popularBooks.map(book => (
            <div key={book.id} className="book-card-v2">
              <div className="card-top" onClick={() => showRatingPopup(book)}>
                <img 
                  src={`http://localhost:6060/images/${book.cover}`} 
                  alt={book.title} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:6060/images/default-cover.jpg'; }}
                />
              </div>
              <div className="card-body">
                <span className="genre-label">{book.genre}</span>
                <h3>{book.title}</h3>
                <p className="author-name">by {book.author}</p>
                <div className="rating-row">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(book.rating || 0) ? "star-filled" : "star-empty"} />
                    ))}
                  </div>
                  {/* ✅ FIXED: Rating displays correctly from the pinned book data */}
                  <span className="rating-num">{book.rating ? book.rating.toFixed(1) : "0.0"}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-read-now" onClick={() => handleRead(book)}>Read Now</button>
                <button className="btn-review-card" onClick={() => navigate(`/reviews/${book.id}`)}>Review</button>
                <button className="btn-bookmark" onClick={() => savedBooks.has(book.id) ? handleUnsave(book.id) : handleSave(book)}>
                  <FaBookmark color={savedBooks.has(book.id) ? "#8b5e3c" : "#ccc"} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedBookForRating && (
        <div className="custom-modal-overlay" onClick={closeRatingPopup}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Book Rating</h3>
            <div className="modal-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < Math.round(selectedBookForRating.rating || 0) ? "#8b5e3c" : "#ddd"} size={28} />
              ))}
              <span className="modal-rating-num">({selectedBookForRating.rating ? selectedBookForRating.rating.toFixed(1) : "0.0"})</span>
            </div>
            <div className="modal-buttons">
              <button className="btn-modal-ok" onClick={closeRatingPopup}>OK</button>
              <button className="btn-modal-view" onClick={() => navigate(`/reviews/${selectedBookForRating.id}`)}>View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;