import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaBookmark,
  FaStar,
  FaCommentAlt,
} from "react-icons/fa";
import { useToast } from "../context/ToastContext";
import "../css/bookcard.css";

const BookCard = ({ book, onRate, layout }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // ✅ LINT-SAFE: lazy initialization
  const [saved, setSaved] = useState(() => {
    const library = JSON.parse(localStorage.getItem("library")) || [];
    return library.some((b) => b.id === book.id);
  });

  const handleSave = (e) => {
    e.stopPropagation();

    const library = JSON.parse(localStorage.getItem("library")) || [];

    if (saved) {
      localStorage.setItem(
        "library",
        JSON.stringify(library.filter((b) => b.id !== book.id))
      );
      showToast("Removed from library", "info");
    } else {
      localStorage.setItem(
        "library",
        JSON.stringify([...library, { ...book, status: "Saved" }])
      );
      showToast("Saved to your library", "success");
    }

    setSaved((prev) => !prev);
  };

  const handleRead = (e) => {
    e.stopPropagation();

    const library = JSON.parse(localStorage.getItem("library")) || [];
    const updated = library.filter((b) => b.id !== book.id);

    updated.push({ ...book, status: "Currently Reading" });
    localStorage.setItem("library", JSON.stringify(updated));

    showToast("Added to Currently Reading", "success");
  };

  return (
    <div
      className={`book-card-premium ${
        layout === "featured" ? "featured-layout" : ""
      }`}
      onClick={() => navigate(`/reviews/${book.id}`)}
    >
      <div className="card-img-container">
        <img src={book.image} alt={book.title} />

        <button
          className={`save-icon-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
        >
          <FaBookmark />
        </button>
      </div>

      <div className="card-info">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">by {book.author}</p>

        <button
          className="btn-rating"
          onClick={(e) => {
            e.stopPropagation();
            onRate(book);
          }}
        >
          <FaStar /> {book.rating}
        </button>

        <div className="card-footer-btns">
          <button className="btn-action-main" onClick={handleRead}>
            <FaPlay /> Read Now
          </button>

          <button
            className="btn-reviews-link"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/reviews/${book.id}`);
            }}
          >
            <FaCommentAlt /> Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
