import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createCategory } from '../services/api';
import { useToast } from '../context/ToastContext';

const AddCategoryModal = ({ isOpen, onClose, onRefresh }) => {
    const [name, setName] = useState('');
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory({ name });
            showToast("Category added successfully!", "success");
            setName('');
            onRefresh();
            onClose();
        } catch {
            showToast("Failed to add category", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="category-modal-content">
                {/* Close Button matching your Edit/Delete style */}
                <button onClick={onClose} className="close-x-top">
                    <FaTimes />
                </button>

                <form className="category-form" onSubmit={handleSubmit}>
                    <h2>Add New Genre</h2>
                    
                    <div className="category-input-group">
                        <label>Genre Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Mystery, Sci-Fi" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-category-submit">
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;