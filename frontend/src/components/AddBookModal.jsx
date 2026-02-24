import React, { useState } from 'react';
import { FaTimes, FaImage } from 'react-icons/fa';
import { createBook } from '../services/api';
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

const AddBookModal = ({ isOpen, onClose, onRefresh, categories }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '', author: '', genre: '', description: '', coverImage: '' 
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.coverImage) return showToast("Please select a cover image", "error");
      try {
          await createBook(formData);
          showToast("Book published successfully!", "success");
          onRefresh(); 
          onClose();
          setFormData({ title: '', author: '', genre: '', description: '', coverImage: '' });
      } catch {
          showToast("Failed to add book", "error");
      }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-compact">
                <div className="modal-header-small">
                    <h2>Add New Book</h2>
                    <button onClick={onClose} className="close-x"><FaTimes /></button>
                </div>
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
                        <label>Genre</label>
                        <select name="genre" value={formData.genre} onChange={handleChange} required>
                            <option value="">-- Select --</option>
                            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" rows="2" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="cover-picker-small">
                        <div className="picker-label"><FaImage /> <span>Cover Asset</span></div>
                        <select name="coverImage" value={formData.coverImage} onChange={handleChange} required>
                            <option value="">Choose file...</option>
                            {availableCovers.map((cover, index) => (
                                <option key={index} value={cover.fileName}>{cover.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button type="submit" className="btn-primary-small">Publish Book</button>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;