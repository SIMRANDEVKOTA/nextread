import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, getUserReviews, deleteReview, updateReview, updateProfile } from "../../services/api"; 
import { useAuth } from "../../context/AuthContext"; 
import { FaArrowLeft, FaUserCircle, FaEdit, FaTrash, FaStar, FaTimes, FaSignOutAlt } from "react-icons/fa";
import "../../css/profile.css"; 

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const [user, setUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); 
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false); 

  const [editingReview, setEditingReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [hover, setHover] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      const { data: profileData } = await getProfile();
      setUser(profileData);
      setNewUsername(profileData.username);
      const { data: reviewsData } = await getUserReviews();
      setUserReviews(reviewsData);
    } catch { 
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    try {
      await updateReview(editingReview.id, {
        rating: editingReview.rating,
        comment: editingReview.comment
      });
      setIsEditModalOpen(false);
      await fetchUserData(); 
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({ username: newUsername });
      setIsProfileEditOpen(false);
      await fetchUserData(); 
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(reviewToDelete);
      setUserReviews(prev => prev.filter(r => r.id !== reviewToDelete));
      setIsDeleteModalOpen(false);
    } catch (err) { 
      console.error("Delete failed:", err); 
    }
  };

  if (loading) return <div className="loader">Loading Profile...</div>;

  return (
    <div className="profile-page">
      <button className="nav-back-arrow-fixed" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="profile-container">
        <div className="profile-header">
          <FaUserCircle size={80} color="#8b5e3c" />
          <h1>{user?.username}</h1>
          <p className="profile-email">{user?.email}</p>
          
          <div className="profile-header-actions">
            <button className="btn-header-edit" onClick={() => setIsProfileEditOpen(true)}>
              <FaEdit /> Edit Profile
            </button>
            <button className="btn-header-logout" onClick={() => setIsLogoutModalOpen(true)}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <section className="profile-reviews-section">
          <h2 className="section-heading">My Reviews and Ratings</h2>
          <div className="reviews-list-container">
            {userReviews.length > 0 ? (
              userReviews.map((rev) => (
                <div key={rev.id} className="prof-review-card-modern">
                  <div className="prof-book-info-col">
                    <img 
                      src={`http://localhost:6060/images/${rev.Book?.cover}`} 
                      alt="book" 
                      className="prof-rev-img-large" 
                      onError={(e) => e.target.src = 'http://localhost:6060/images/default-cover.jpg'}
                    />
                    <h3 className="prof-book-title-sub">{rev.Book?.title}</h3>
                    <div className="prof-stars-sub">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < rev.rating ? "#FFD700" : "#ddd"} size={14} />
                      ))}
                    </div>
                  </div>

                  <div className="prof-rev-content-col">
                    <div className="prof-meta-top">
                      <div className="prof-user-badge-small">
                        {user?.username?.substring(0, 2).toUpperCase()}
                      </div>
                      <strong>{user?.username}</strong>
                      <span className="rev-date-tag">recently</span>
                    </div>
                    
                    <p className="prof-comment-text">"{rev.comment}"</p>
                    
                    <div className="prof-actions-row">
                      <button className="prof-btn-edit" onClick={() => { setEditingReview({...rev}); setIsEditModalOpen(true); }}>
                        <FaEdit /> Edit
                      </button>
                      <button className="prof-btn-delete" onClick={() => { setReviewToDelete(rev.id); setIsDeleteModalOpen(true); }}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state-text">No reviews shared yet.</p>
            )}
          </div>
        </section>
      </div>

      {isEditModalOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content-compact">
            <div className="modal-header">
              <h3>Edit Your Review</h3>
              <button className="modal-close-x" onClick={() => setIsEditModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <label className="modal-label">Your Rating</label>
              <div className="modal-star-rating">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <FaStar 
                      key={i}
                      className="star-clickable"
                      color={ratingValue <= (hover || editingReview.rating) ? "#FFD700" : "#e4e4e4"}
                      size={32}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setEditingReview(prev => ({ ...prev, rating: ratingValue }))}
                    />
                  );
                })}
              </div>
              <label className="modal-label">Your Review</label>
              <textarea 
                value={editingReview.comment}
                onChange={(e) => setEditingReview(prev => ({ ...prev, comment: e.target.value }))}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-update-theme" onClick={handleUpdateReview}>Update Review</button>
              <button className="btn-cancel-theme" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isProfileEditOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content-compact">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close-x" onClick={() => setIsProfileEditOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <label className="modal-label">Username</label>
              <input 
                type="text"
                className="modal-input-field"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-update-theme" onClick={handleProfileUpdate}>Save Changes</button>
              <button className="btn-cancel-theme" onClick={() => setIsProfileEditOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isLogoutModalOpen && (
        <div className="edit-modal-overlay">
          <div className="delete-modal-content-compact">
            <div className="modal-header">
              <h3>Logout</h3>
              <button className="modal-close-x" onClick={() => setIsLogoutModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <p className="modal-text-secondary">Are you sure you want to logout?</p>
            <div className="modal-footer">
              <button className="btn-confirm-delete-theme" onClick={logout}>Logout</button>
              <button className="btn-cancel-theme" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="edit-modal-overlay">
          <div className="delete-modal-content-compact">
            <div className="modal-header">
              <h3>Delete Review?</h3>
              <button className="modal-close-x" onClick={() => setIsDeleteModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <p className="modal-text-secondary">This will permanently remove your review.</p>
            <div className="modal-footer">
              <button className="btn-confirm-delete-theme" onClick={handleDeleteReview}>Delete</button>
              <button className="btn-cancel-theme" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;