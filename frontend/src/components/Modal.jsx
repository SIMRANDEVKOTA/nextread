//this is a reusable modal component that can be used for both warning
//  and success messages. It takes in props for the title, message, 
// onConfirm and onCancel functions, and the type of modal (warning or success). 
// The modal will display an appropriate icon based on the type and will 
// have buttons for confirming or canceling the action.
import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaTimes } from "react-icons/fa";
import "../css/modal.css";

const Modal = ({ title, message, onConfirm, onCancel, type = "warning" }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content-premium" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onCancel}><FaTimes /></button>
        
        <div className="modal-body">
          <div className={`modal-icon-circle ${type}`}>
            {type === "warning" ? <FaExclamationTriangle /> : <FaCheckCircle />}
          </div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-modal-primary" onClick={onConfirm}>Yes, Proceed</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;