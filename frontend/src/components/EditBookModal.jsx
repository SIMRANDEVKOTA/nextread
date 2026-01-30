import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { updateBook } from '../services/api';
import { useToast } from '../context/ToastContext';

const EditBookModal = ({ isOpen, onClose, onRefresh, book }) => {
    const { showToast } = useToast();

    // ✅ FIXED: Added 'cover' to state so we can fix broken filenames like 'ends.jpeg'
    const [formData, setFormData] = useState({
        title: book?.title || '',
        author: book?.author || '',
        genre: book?.genre || '',
        description: book?.description || '',
        cover: book?.cover || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBook(book.id, formData);
            showToast("Book updated successfully", "success");
            onRefresh();
            onClose();
        } catch (err) {
            console.error("Update error details:", err);
            showToast("Failed to update book", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content admin-theme">
                <div className="modal-header">
                    <h2>Edit Book Details</h2>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>
                
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <label className="field-label">Book Title</label>
                        <input 
                            type="text"
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="input-wrapper">
                        <label className="field-label">Author Name</label>
                        <input 
                            type="text"
                            value={formData.author} 
                            onChange={(e) => setFormData({...formData, author: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="input-wrapper">
                        <label className="field-label">Genre</label>
                        <input 
                            type="text"
                            value={formData.genre} 
                            onChange={(e) => setFormData({...formData, genre: e.target.value})} 
                            required 
                        />
                    </div>

                    {/* ✅ NEW: Field to fix broken covers like 'ends.jpeg' */}
                    <div className="input-wrapper">
                        <label className="field-label">Cover Image Filename</label>
                        <input 
                            type="text" 
                            value={formData.cover} 
                            onChange={(e) => setFormData({ ...formData, cover: e.target.value })} 
                            placeholder="e.g., ends.jpeg"
                        />
                        <small style={{ color: "#666", fontSize: "11px", marginTop: "4px", display: "block" }}>
                            Must match file name in backend/public/images/
                        </small>
                    </div>

                    <div className="input-wrapper">
                        <label className="field-label">Description</label>
                        <textarea 
                            rows="5" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="submit-admin-btn">Save Changes</button>
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;