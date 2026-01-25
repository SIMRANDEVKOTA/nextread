import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <div className="delete-icon-wrapper">
          <FaExclamationTriangle />
        </div>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to permanently delete <strong>{itemName}</strong>?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-delete-btn" onClick={onConfirm}>Delete Now</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;