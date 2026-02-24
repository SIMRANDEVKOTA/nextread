// this component is used to confirm deletion of an item, 
// such as a project or task. It displays a warning icon and asks the user
//  to confirm their action before permanently deleting the item. 
import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal-compact">
        <button className="close-x-top" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="danger-icon-brown">
          <FaExclamationTriangle />
        </div>
        
        <div className="delete-info">
          <h3>Confirm Deletion</h3>
          <p>Remove <strong>{itemName}</strong> permanently?</p>
        </div>
        
        <div className="compact-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm-brown" onClick={onConfirm}>Delete Now</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;