//this component is a modal that allows users to rate a book and leave a review.
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useLibrary } from "../hooks/useLibrary";
import { addReview } from "../services/api";
import "../css/modal.css";

const RatingModal = ({ book, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { updateStatus } = useLibrary();

  const submitRating = async () => {
    await updateStatus(book.id, "Completed", 100, rating);
    await addReview(book.id, { rating, comment });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-premium">
        <h2>Rate this book</h2>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <FaStar
              key={n}
              color={n <= rating ? "#FFA000" : "#ccc"}
              onClick={() => setRating(n)}
            />
          ))}
        </div>

        <textarea
          placeholder="Write a short review (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="modal-footer">
          <button className="btn-modal-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-modal-primary" onClick={submitRating}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
