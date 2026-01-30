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
            <div className="modal-content admin-theme" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>Add New Genre</h2>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <label className="field-label">Genre Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Mystery, Sci-Fi" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="submit-admin-btn">Add Category</button>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;