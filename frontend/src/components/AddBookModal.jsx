import React, { useState } from 'react';
import { FaTimes, FaImage } from 'react-icons/fa';
import { createBook } from '../services/api';
import { useToast } from '../context/ToastContext';

// ✅ UPDATED: Included Binding 13 and other backend images
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
            <div className="modal-content admin-theme">
                <div className="modal-header"><h2>Add New Book to Library</h2><button onClick={onClose} className="close-btn"><FaTimes /></button></div>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper"><label className="field-label">Book Title</label><input name="title" type="text" value={formData.title} onChange={handleChange} required /></div>
                    <div className="input-wrapper"><label className="field-label">Author Name</label><input name="author" type="text" value={formData.author} onChange={handleChange} required /></div>
                    <div className="input-wrapper">
                        <label className="field-label">Genre</label>
                        <select name="genre" value={formData.genre} onChange={handleChange} required>
                            <option value="">-- Select Category --</option>
                            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="input-wrapper"><label className="field-label">Description</label><textarea name="description" rows="4" value={formData.description} onChange={handleChange}></textarea></div>
                    <div className="file-upload-zone">
                        <FaImage style={{ fontSize: '20px', color: '#8b5e3c', marginBottom: '8px' }} />
                        <p>Select Cover from Local Assets</p>
                        <select name="coverImage" value={formData.coverImage} onChange={handleChange} required>
                            <option value="">-- Choose an Image --</option>
                            {availableCovers.map((cover, index) => (
                                <option key={index} value={cover.fileName}>{cover.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="submit-admin-btn">Publish to Library</button>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;