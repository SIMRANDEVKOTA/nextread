import React, { useState } from 'react';
import { FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { createBook } from '../services/api';
import { useToast } from '../context/ToastContext';

const AddBookModal = ({ isOpen, onClose, onRefresh }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '', author: '', genre: '', description: '', coverImage: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBook(formData);
            showToast("Book published successfully!", "success");
            onRefresh(); 
            onClose();
        } catch (error) {
            // ✅ FIXED: Using the error variable to satisfy ESLint
            console.error("Error adding book:", error);
            showToast("Failed to add book", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content admin-theme">
                <div className="modal-header">
                    <h2>Add New Book to Library</h2>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <input 
                        name="title" 
                        type="text" 
                        placeholder="Book Title" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        name="author" 
                        type="text" 
                        placeholder="Author Name" 
                        onChange={handleChange} 
                        required 
                    />
                    <select name="genre" onChange={handleChange} required>
                        <option value="">Select Genre</option>
                        <option value="Romance">Romance</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Thriller">Thriller</option>
                    </select>
                    <textarea 
                        name="description" 
                        placeholder="Description..." 
                        rows="4" 
                        onChange={handleChange}
                    ></textarea>
                    <div className="file-upload-zone">
                        <FaCloudUploadAlt />
                        <p>Cover Image URL</p>
                        <input 
                            name="coverImage" 
                            type="text" 
                            placeholder="Image URL" 
                            onChange={handleChange} 
                        />
                    </div>
                    <button type="submit" className="submit-admin-btn">Publish to Library</button>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;