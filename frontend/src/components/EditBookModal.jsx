import React, { useState } from "react";
import { updateBook } from "../services/api";
import { useToast } from "../context/ToastContext";

const EditBookModal = ({ isOpen, onClose, onRefresh, book }) => {
  // ✅ FIXED: Initializing state directly from props
  // This avoids the 'set-state-in-effect' error
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    genre: book?.genre || "",
    description: book?.description || "",
    cover: book?.cover || ""
  });
  
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(book.id, formData);
      showToast("Book updated successfully", "success");
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Failed to update book", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal" style={{ maxWidth: '550px', textAlign: 'left' }}>
        <h2 style={{ color: '#2d241e', marginBottom: '1.5rem' }}>Edit Book Details</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Book Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>
          
          <div className="form-group" style={{ marginTop: '15px' }}>
            <label>Genre</label>
            <input 
              type="text" 
              value={formData.genre} 
              onChange={(e) => setFormData({...formData, genre: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginTop: '15px' }}>
            <label>Description</label>
            <textarea 
              rows="4"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
            <button type="submit" className="add-btn">Save Changes</button>
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn" 
              style={{ background: '#e8e2da', color: '#2d241e', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;