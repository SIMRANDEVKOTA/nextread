import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getGenres, 
  getRecommendations, 
  addToLibrary, 
  fetchAllBooks, 
  fetchAllReviews // ✅ Added this
} from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { FaStar, FaBookmark, FaRegBookmark, FaSearch, FaBookOpen, FaArrowLeft } from "react-icons/fa";
import "../../css/recommend.css";

const Recommend = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]); // ✅ Added to store reviews
  const [loading, setLoading] = useState(false);
  const [savedBooks, setSavedBooks] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookForRating, setSelectedBookForRating] = useState(null);

  // ✅ Calculation logic for ratings
  const getAvgRating = (bookId) => {
    if (!reviews || !Array.isArray(reviews)) return 0;
    const bookReviews = reviews.filter(
      r => r.book_id === bookId || r.BookId === bookId || r.bookId === bookId
    );
    if (bookReviews.length === 0) return 0;
    const sum = bookReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return sum / bookReviews.length;
  };

  const loadRecommendations = useCallback(async (genre) => {
    setLoading(true);
    try {
      const [bookRes, reviewRes] = await Promise.all([
        genre === "All" ? fetchAllBooks() : getRecommendations(genre),
        fetchAllReviews() // ✅ Fetch reviews to sync ratings
      ]);
      setBooks(bookRes?.data || []);
      setReviews(reviewRes?.data || []);
    } catch {
      showToast("Failed to load recommendations", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadGenres = useCallback(async () => {
    try {
      const { data } = await getGenres();
      setGenres([{ genre: "All" }, ...data]);
      setSelectedGenre("All");
      loadRecommendations("All");
    } catch {
      showToast("Failed to load genres", "error");
    }
  }, [showToast, loadRecommendations]);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  const showRatingPopup = (book, dynamicRating) => {
    setSelectedBookForRating({ ...book, dynamicRating });
  };

  const closeRatingPopup = () => {
    setSelectedBookForRating(null);
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (book) => {
    if (!user) return showToast("Please login first", "error");
    try {
      await addToLibrary({ bookId: book.id, status: "to-read" });
      setSavedBooks(prev => new Set([...prev, book.id]));
      showToast("Added to library", "success");
    } catch {
      showToast("Failed to save book", "error");
    }
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

  return (
    <div className="recommend-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <header className="recommend-header">
        <div className="sub-tag"><FaBookOpen className="icon" /> BROWSE BY GENRE</div>
        <h1>Genre Based Recommendations</h1>
        <p>Find your perfect book based on your favorite genres</p>
      </header>

      <div className="filter-bar">
        <div className="genre-pills">
          {genres.map((g) => (
            <button
              key={g.genre}
              className={`pill ${selectedGenre === g.genre ? "active" : ""}`}
              onClick={() => {
                setSelectedGenre(g.genre);
                loadRecommendations(g.genre);
              }}
            >
              {g.genre}
            </button>
          ))}
        </div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search book or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader">Searching for books...</div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => {
            const rating = getAvgRating(book.id); // ✅ Calculate dynamic rating
            return (
              <div key={book.id} className="book-card-v2">
                <div className="card-top" onClick={() => showRatingPopup(book, rating)} style={{ cursor: 'pointer' }}>
                  <img 
                    src={`http://localhost:6060/images/${book.cover}`} 
                    alt={book.title} 
                    onError={(e) => e.target.src = 'http://localhost:6060/images/default-cover.jpg'}
                  />
                </div>
                
                <div className="card-body">
                  <span className="genre-label">{book.genre}</span>
                  <h3>{book.title}</h3>
                  <p className="author-name">by {book.author}</p>
                  <div className="rating-row">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(rating) ? "star-filled" : "star-empty"} />
                      ))}
                    </div>
                    <span className="rating-num">{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-read-now" onClick={() => handleRead(book)}>Read Now</button>
                  <button className="btn-review-card" onClick={() => navigate(`/reviews/${book.id}`)}>Review</button>
                  <button className="btn-bookmark" onClick={() => handleSave(book)}>
                    {savedBooks.has(book.id) ? <FaBookmark color="#8b5e3c" /> : <FaRegBookmark color="#ccc" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBookForRating && (
        <div className="custom-modal-overlay" onClick={closeRatingPopup}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Book Rating</h3>
            <p>Total rating of the book is:</p>
            <div className="modal-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(selectedBookForRating.dynamicRating || 0) ? "#8b5e3c" : "#ddd"}
                  size={28}
                />
              ))}
              <span className="modal-rating-num">
                ({selectedBookForRating.dynamicRating ? selectedBookForRating.dynamicRating.toFixed(1) : "0.0"})
              </span>
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

export default Recommend;