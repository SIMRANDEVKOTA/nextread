import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReviews, addReview, fetchBookDetails } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { getBookImage } from "../../utils/bookImages";
import { FaStar, FaArrowLeft, FaPaperPlane, FaUserCircle } from "react-icons/fa";
import "../../css/reviews.css";

const Reviews = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookRes, reviewsRes] = await Promise.all([
        fetchBookDetails(id),
        getReviews(id)
      ]);
      setBook(bookRes.data);
      setReviews(reviewsRes.data);
    } catch {
      showToast("Failed to load book reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return showToast("Please write a comment", "info");
    try {
      await addReview(id, newReview);
      showToast("Review shared!", "success");
      setNewReview({ rating: 5, comment: "" });
      loadData();
    } catch {
      showToast("Failed to post review", "error");
    }
  };

  if (loading) return <div className="review-loader">Gathering thoughts...</div>;
  if (!book) return <div className="error-state">Book not found.</div>;

  return (
    <div className="reviews-page">
      <div className="reviews-wrapper">
        <button className="review-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="reviews-main-grid">
          <section className="book-showcase">
            <div className="sticky-book-content">
              <div className="book-poster">
                <img src={getBookImage(book.cover)} alt={book.title} />
              </div>
              <div className="book-meta">
                <span className="meta-genre">{book.genre}</span>
                <h1>{book.title}</h1>
                <p className="meta-author">by <span>{book.author}</span></p>
                <div className="overall-score">
                  <div className="score-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color={i < Math.round(book.rating) ? "#FFD700" : "#eee"} size={18}/>
                    ))}
                  </div>
                  <span className="score-num">{book.rating?.toFixed(1)} / 5.0</span>
                </div>
              </div>
            </div>
          </section>

          <section className="community-feedback">
            <div className="feedback-form-card">
              <h3>Share Your Thoughts</h3>
              <form onSubmit={handleSubmit}>
                <div className="star-rating-input">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                      <label key={i}>
                        <input 
                          type="radio" 
                          name="rating" 
                          className="rating-radio-hidden"
                          value={ratingValue} 
                          onClick={() => setNewReview({...newReview, rating: ratingValue})} 
                        />
                        <FaStar 
                          className="input-star"
                          color={ratingValue <= (hover || newReview.rating) ? "#FFD700" : "#e4e4e4"}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                          size={24}
                        />
                      </label>
                    );
                  })}
                  <span className="rating-label">{newReview.rating} Stars</span>
                </div>
                
                <textarea 
                  placeholder="What did you think?..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                />
                <button type="submit" className="submit-review-btn">
                  Post Review <FaPaperPlane size={14} />
                </button>
              </form>
            </div>

            <div className="reviews-feed">
              <div className="feed-header">
                <h2>Reader Discussion</h2>
                <span className="count">{reviews.length} Reviews</span>
              </div>

              {reviews.map((rev) => (
                <div key={rev.id} className="user-review-card">
                  <div className="user-avatar">
                    <FaUserCircle size={32}/>
                  </div>
                  <div className="review-content-area">
                    <div className="rev-user-info">
                      <strong>{rev.User?.username || "Reader"}</strong>
                      <div className="user-rev-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={12} color={i < rev.rating ? "#FFD700" : "#eee"} />
                        ))}
                      </div>
                    </div>
                    <p className="rev-text">{rev.comment}</p>
                    <span className="rev-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Reviews;