import React, { useState } from 'react';
import { FaTimes, FaSave, FaImage } from 'react-icons/fa';
import { updateBook } from '../services/api';
import { useToast } from '../context/ToastContext';

const availableCovers = [
    { name: 'It Ends With Us', fileName: 'ends.jpeg' },
    { name: 'The Housemaid', fileName: 'housemaid.jpeg' },
    { name: 'Powerless', fileName: 'powerless.webp' },
    { name: 'The Cruel Prince', fileName: 'cruel.jpg' },
    { name: 'Atomic Habits', fileName: 'atomic_habits.jpg' },
    { name: 'Murder Mystery', fileName: 'murder.jpeg' },
    { name: 'Twisted Love', fileName: 'twisted.jpg' },
    { name: 'Binding 13', fileName: 'tommen.jpeg' }, 
    { name: 'Anne of Green Gables', fileName: 'anne.jpg' },
    { name: 'The Woman in Me', fileName: 'woman.jpeg' }
];

const EditBookForm = ({ onClose, onRefresh, book, categories, showToast }) => {
    const [formData, setFormData] = useState({
        title: book?.title || '',
        author: book?.author || '',
        genre: book?.genre || '',
        description: book?.description || '',
        coverImage: book?.coverImage || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBook(book.id, formData);
            showToast("Book updated successfully", "success");
            onRefresh();
            onClose();
        } catch {
            showToast("Failed to update book", "error");
        }
    };

    return (
        <form className="admin-form-compact" onSubmit={handleSubmit}>
            <div className="compact-grid">
                <div className="input-group">
                    <label>Title</label>
                    <input name="title" type="text" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Author</label>
                    <input name="author" type="text" value={formData.author} onChange={handleChange} required />
                </div>
            </div>

            <div className="input-group">
                <label>Genre / Category</label>
                <select name="genre" value={formData.genre} onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    
                    {/* 1. If we have a list of categories from the database, show them */}
                    {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                            <option key={cat.id || cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))
                    ) : (
                        /* 2. Fallback: If no categories list, show the book's current genre so it's not empty */
                        formData.genre && <option value={formData.genre}>{formData.genre}</option>
                    )}
                </select>

            </div>

            <div className="input-group">
                <label>Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
            </div>

            <div className="cover-picker-small">
                <div className="picker-label"><FaImage /> <span>Update Cover Asset</span></div>
                <select name="coverImage" value={formData.coverImage} onChange={handleChange} required>
                    <option value="">Choose file...</option>
                    {availableCovers.map((cover, index) => (
                        <option key={index} value={cover.fileName}>{cover.name}</option>
                    ))}
                </select>
            </div>
            
            <button type="submit" className="btn-primary-small">
                <FaSave style={{marginRight: '8px'}} /> Save Changes
            </button>
        </form>
    );
};

const EditBookModal = ({ isOpen, onClose, onRefresh, book, categories }) => {
    const { showToast } = useToast();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-compact">
                <div className="modal-header-small">
                    <h2>Edit Book Details</h2>
                    <button type="button" onClick={onClose} className="close-x">
                        <FaTimes />
                    </button>
                </div>

                {book && (
                    <EditBookForm
                        key={book.id} 
                        book={book}
                        categories={categories}
                        onClose={onClose}
                        onRefresh={onRefresh}
                        showToast={showToast}
                    />
                )}
            </div>
        </div>
    );
};

export default EditBookModal;