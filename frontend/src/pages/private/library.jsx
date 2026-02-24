import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyLibrary as getLibrary,
  updateBookStatus as updateStatus,
  removeFromLibrary as deleteFromLibrary,
  updateProgress,
} from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
  FaArrowLeft,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import "../../css/library.css";

// ✅ FIXED: Isolated Component with string-state to allow backspacing and prevent "0100"
const ProgressEditor = ({ book, onSave, onCancel }) => {
  const [pages, setPages] = useState(book.currentPage.toString());

  const handleInputChange = (e) => {
    let val = e.target.value;
    
    // Remove leading zeros (prevents 0100)
    if (val.length > 1 && val.startsWith("0")) {
      val = val.replace(/^0+/, "");
    }
    
    // Allow digits or empty string (for backspacing)
    if (val === "" || /^\d+$/.test(val)) {
      setPages(val);
    }
  };

  return (
    <div className="progress-edit">
      <input 
        type="text" 
        inputMode="numeric"
        value={pages} 
        onChange={handleInputChange}
        placeholder="0"
        autoFocus
      />
      <button className="btn-save" onClick={() => onSave(parseInt(pages || 0, 10))}>Save</button>
      <button className="btn-cancel" onClick={onCancel}>Cancel</button>
    </div>
  );
};

const Library = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ TRACK BY BookId - This is guaranteed to be unique for each book
  const [editingBookId, setEditingBookId] = useState(null); 
  
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null
  });

  const loadLibrary = useCallback(async () => {
    try {
      const { data } = await getLibrary();
      setLibrary(data);
    } catch {
      showToast("Failed to load library", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const toRead = library.filter((b) => b.status === "to-read");
  const reading = library.filter((b) => b.status === "currently-reading");
  const completed = library.filter((b) => b.status === "completed");

  const handleStartReading = (book) => {
    setModalConfig({
      show: true,
      title: "Start Reading",
      message: `Move "${book.Book?.title}" to Currently Reading?`,
      onConfirm: async () => {
        try {
          await updateStatus(book.BookId, "currently-reading");
          setModalConfig({ ...modalConfig, show: false });
          loadLibrary();
        } catch { showToast("Action failed", "error"); }
      }
    });
  };

  const handleFinish = (book) => {
    setModalConfig({
      show: true,
      title: "Complete Book",
      message: `Have you finished reading "${book.Book?.title}"?`,
      onConfirm: async () => {
        try {
          await updateStatus(book.BookId, "completed");
          setModalConfig({ ...modalConfig, show: false });
          loadLibrary();
        } catch { showToast("Action failed", "error"); }
      }
    });
  };

  const handleUpdateProgress = async (bookId, newPages) => {
    try {
      await updateProgress(bookId, { currentPage: newPages });
      setEditingBookId(null);
      loadLibrary();
      showToast("Progress updated", "success");
    } catch {
      showToast("Failed to update progress", "error");
    }
  };

  const handleDelete = (bookId, title) => {
    setModalConfig({
      show: true,
      title: "Confirm Delete",
      message: `Remove "${title}" from your library?`,
      onConfirm: async () => {
        try {
          await deleteFromLibrary(bookId);
          setModalConfig({ ...modalConfig, show: false });
          loadLibrary();
        } catch { showToast("Failed to delete", "error"); }
      }
    });
  };

  if (loading) return <div className="loader" style={{color: "#8b5e3c"}}>Loading library...</div>;

  return (
    <div className="library-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="library-header">
        <h1>My Library</h1>
        <div className="library-stats">
          <div className="stat"><span className="stat-number">{toRead.length}</span><span className="stat-label">To Read</span></div>
          <div className="stat"><span className="stat-number">{reading.length}</span><span className="stat-label">Reading</span></div>
          <div className="stat"><span className="stat-number">{completed.length}</span><span className="stat-label">Completed</span></div>
        </div>
      </div>

      <section className="library-section">
        <h2>To Read ({toRead.length})</h2>
        {toRead.length > 0 ? (
          <div className="books-list">
            {toRead.map((book) => (
              <div key={book.BookId} className="library-item">
                <img 
                  src={`http://localhost:6060/images/${book.Book?.cover}`} 
                  alt={book.Book?.title} 
                  className="book-thumb" 
                  onError={(e) => e.target.src = 'http://localhost:6060/images/default-cover.jpg'}
                />
                <div className="item-info"><h4>{book.Book?.title}</h4><p>{book.Book?.author}</p></div>
                <div className="item-actions">
                  <button className="btn-primary" onClick={() => handleStartReading(book)}>Read Now</button>
                  <button className="btn-delete" onClick={() => handleDelete(book.BookId, book.Book?.title)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="empty-state">No books to read.</p>}
      </section>

      <section className="library-section">
        <h2>Currently Reading ({reading.length})</h2>
        {reading.length > 0 ? (
          <div className="books-list">
            {reading.map((book) => (
              <div key={book.BookId} className="library-item reading">
                <img 
                  src={`http://localhost:6060/images/${book.Book?.cover}`} 
                  alt={book.Book?.title} 
                  className="book-thumb" 
                  onError={(e) => e.target.src = 'http://localhost:6060/images/default-cover.jpg'}
                />
                <div className="item-info">
                  <h4>{book.Book?.title}</h4><p>{book.Book?.author}</p>
                  <div className="progress-section">
                    {/* ✅ FIXED: Using BookId for strict uniqueness check */}
                    {editingBookId === book.BookId ? (
                      <ProgressEditor 
                        book={book} 
                        onSave={(newPages) => handleUpdateProgress(book.BookId, newPages)} 
                        onCancel={() => setEditingBookId(null)} 
                      />
                    ) : (
                      <div className="progress-display">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(book.currentPage / (book.totalPages || 1)) * 100}%` }}></div>
                        </div>
                        <span className="progress-text">{book.currentPage} / {book.totalPages} pages</span>
                        <button className="btn-edit-progress" onClick={() => setEditingBookId(book.BookId)}>Update Progress</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn-finish" onClick={() => handleFinish(book)}><FaCheck /> Finish</button>
                  <button className="btn-delete" onClick={() => handleDelete(book.BookId, book.Book?.title)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="empty-state">No active books.</p>}
      </section>

      <section className="library-section">
        <h2>Completed ({completed.length})</h2>
        {completed.length > 0 ? (
          <div className="books-list">
            {completed.map((book) => (
              <div key={book.BookId} className="library-item completed">
                <img 
                  src={`http://localhost:6060/images/${book.Book?.cover}`} 
                  alt={book.Book?.title} 
                  className="book-thumb" 
                  onError={(e) => e.target.src = 'http://localhost:6060/images/default-cover.jpg'}
                />
                <div className="item-info">
                  <h4>{book.Book?.title}</h4><p>{book.Book?.author}</p>
                  <p className="completed-label"><FaCheck /> Completed</p>
                </div>
                <div className="item-actions">
                  <button className="btn-delete" onClick={() => handleDelete(book.BookId, book.Book?.title)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="empty-state">No completed books.</p>}
      </section>

      {modalConfig.show && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h3>{modalConfig.title}</h3>
            <p>{modalConfig.message}</p>
            <div className="modal-btns">
              <button className="btn-confirm-act" onClick={modalConfig.onConfirm}>Confirm</button>
              <button className="btn-cancel-act" onClick={() => setModalConfig({ ...modalConfig, show: false })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;