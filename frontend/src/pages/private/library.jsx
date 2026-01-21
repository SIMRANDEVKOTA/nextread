import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyLibrary as getLibrary,
  updateBookStatus as updateStatus,
  removeFromLibrary as deleteFromLibrary,
  updateProgress,
} from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { getBookImage } from "../../utils/bookImages";
import {
  FaArrowLeft,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import "../../css/library.css";

const Library = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingPages, setEditingPages] = useState(0);
  
  // ✅ MODAL STATE: Replaces window.confirm and toasts
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

  const handleUpdateProgress = async (book) => {
    try {
      await updateProgress(book.BookId, { currentPage: editingPages });
      setEditingId(null);
      loadLibrary();
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
              <div key={book.id} className="library-item">
                <img src={getBookImage(book.Book?.cover)} alt={book.Book?.title} className="book-thumb" />
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
              <div key={book.id} className="library-item reading">
                <img src={getBookImage(book.Book?.cover)} alt={book.Book?.title} className="book-thumb" />
                <div className="item-info">
                  <h4>{book.Book?.title}</h4><p>{book.Book?.author}</p>
                  <div className="progress-section">
                    {editingId === book.id ? (
                      <div className="progress-edit">
                        <input type="number" min="0" max={book.totalPages} value={editingPages} onChange={(e) => setEditingPages(Number(e.target.value))} />
                        <button className="btn-save" onClick={() => handleUpdateProgress(book)}>Save</button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className="progress-display">
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}></div></div>
                        <span className="progress-text">{book.currentPage} / {book.totalPages} pages</span>
                        <button className="btn-edit-progress" onClick={() => { setEditingId(book.id); setEditingPages(book.currentPage); }}>Update Progress</button>
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
              <div key={book.id} className="library-item completed">
                <img src={getBookImage(book.Book?.cover)} alt={book.Book?.title} className="book-thumb" />
                <div className="item-info"><h4>{book.Book?.title}</h4><p>{book.Book?.author}</p><p className="completed-label"><FaCheck /> Completed</p></div>
                <div className="item-actions">
                  <button className="btn-delete" onClick={() => handleDelete(book.BookId, book.Book?.title)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="empty-state">No completed books.</p>}
      </section>

      {/* ✅ UNIFIED CUSTOM MODAL */}
      {modalConfig.show && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h3>{modalConfig.title}</h3>
            <p>{modalConfig.message}</p>
            <div className="modal-btns" style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px'}}>
              <button className="btn-confirm-act" onClick={modalConfig.onConfirm} style={{background: '#8b5e3c', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700'}}>Confirm</button>
              <button className="btn-cancel-act" onClick={() => setModalConfig({ ...modalConfig, show: false })} style={{background: '#ddd', color: '#333', border: 'none', padding: '10px 25px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;