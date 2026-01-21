
import React, { useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import RatingModal from "./rating";

const LibraryItem = ({ book, onUpdateStatus }) => {
  const { status, progress } = book.UserBooks;
  const [showRating, setShowRating] = useState(false);

  const finishBook = async () => {
    await onUpdateStatus(book.id, "Completed", 100);
    setShowRating(true);
  };

  return (
    <div className="library-item">
      <img
        src={`/src/assets/images/${book.cover || "book.jpg"}`}
        alt={book.title}
      />

      <div className="library-meta">
        <h3>{book.title}</h3>
        <p>by {book.author}</p>

        {status === "Reading" && (
          <>
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }} />
            </div>
            <button className="btn-finish" onClick={finishBook}>
              Finish Book
            </button>
          </>
        )}

        {status === "Plan to Read" && (
          <span className="tag">Next Read</span>
        )}

        {status === "Completed" && (
          <span className="tag completed">Completed</span>
        )}
      </div>

      {showRating && (
        <RatingModal
          book={book}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
};

export default LibraryItem;
