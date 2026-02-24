import React, { useState, useEffect, useCallback } from "react";
import { 
  FaThLarge, FaBookOpen, FaTags, FaUsers, FaSignOutAlt, FaFire,
  FaPlus, FaTrash, FaEdit, FaStar, FaCommentDots 
} from "react-icons/fa";
import { 
  fetchAllBooks, fetchAllUsers, deleteBook, deleteUser, fetchAdminStats,
  fetchAllReviewsAdmin, deleteReview, fetchAllCategories, deleteCategory, updateBook 
} from "../../services/api"; 
import { useToast } from "../../context/ToastContext";
import AddBookModal from "../../components/AddBookModal"; 
import EditBookModal from "../../components/EditBookModal";
import AddCategoryModal from "../../components/AddCategoryModal"; 
import DeleteConfirmModal from "../../components/DeleteConfirmModal"; 
import "../../css/admin.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); 
  const [editBookData, setEditBookData] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, type: "", id: null, name: "" });

  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookRes, userRes, statsRes, reviewRes, catRes] = await Promise.all([
        fetchAllBooks(), fetchAllUsers(), fetchAdminStats(),
        fetchAllReviewsAdmin(), fetchAllCategories() 
      ]);
      setBooks(bookRes.data);
      setUsers(userRes.data);
      setStats(statsRes.data);
      setReviews(reviewRes.data);
      setCategories(catRes.data); 
    } catch {
      showToast("System error: Could not sync admin data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleToggleTrending = async (book) => {
    try {
      await updateBook(book.id, { is_trending: !book.is_trending });
      showToast(!book.is_trending ? "Pinned to Trending" : "Removed from Trending", "success");
      loadData(); 
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfig.type === "book") await deleteBook(deleteConfig.id);
      else if (deleteConfig.type === "user") await deleteUser(deleteConfig.id);
      else if (deleteConfig.type === "review") await deleteReview(deleteConfig.id);
      else if (deleteConfig.type === "category") await deleteCategory(deleteConfig.id);
      showToast(`${deleteConfig.type} deleted successfully`, "success");
      loadData(); 
    } catch {
      showToast(`Error deleting ${deleteConfig.type}`, "error");
    } finally {
      setDeleteConfig({ isOpen: false, type: "", id: null, name: "" });
    }
  };

  if (loading) return <div className="loader">Initializing Admin Panel...</div>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo"><h2>Admin Panel</h2></div>
        <nav>
          <button className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}><FaThLarge /> Overview</button>
          <button className={activeSection === "books" ? "active" : ""} onClick={() => setActiveSection("books")}><FaBookOpen /> Book Management</button>
          <button className={activeSection === "trending" ? "active" : ""} onClick={() => setActiveSection("trending")}><FaFire /> Trending Status</button>
          <button className={activeSection === "reviews" ? "active" : ""} onClick={() => setActiveSection("reviews")}><FaCommentDots /> Reviews</button>
          <button className={activeSection === "categories" ? "active" : ""} onClick={() => setActiveSection("categories")}><FaTags /> Categories</button>
          <button className={activeSection === "users" ? "active" : ""} onClick={() => setActiveSection("users")}><FaUsers /> User Management</button>
        </nav>
        <button className="logout-nav" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}><FaSignOutAlt /> Logout</button>
      </aside>

      <main className="admin-main">
        <header className="admin-top-bar"><h3>{activeSection.toUpperCase()}</h3></header>

        <section className="admin-view-content">
          {activeSection === "overview" && (
            <div className="stats-grid dashboard-enhanced">
              <div className="stat-card"><h3>{stats.totalBooks}</h3><p>Books</p></div>
              <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Registered Users</p></div>
              <div className="stat-card highlight"><h3>{stats.totalReviews}</h3><p><FaStar /> Total Reviews</p></div>
            </div>
          )}

          {activeSection === "books" && (
            <div className="table-container">
              <div className="section-header"><h2>Manage Books</h2><button className="add-btn-primary" onClick={() => setIsModalOpen(true)}><FaPlus /> Add New Book</button></div>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Title</th><th>Avg Rating</th><th>Actions</th></tr></thead>
                <tbody>{books.map(book => {
                    // CALCULATION LOGIC: Find reviews for this book
                    const bookReviews = reviews.filter(r => r.book_id === book.id || r.BookId === book.id);
                    const avgRating = bookReviews.length > 0 
                      ? (bookReviews.reduce((sum, r) => sum + Number(r.rating), 0) / bookReviews.length).toFixed(1)
                      : "0.0";

                    return (
                      <tr key={book.id}>
                          <td>#{book.id}</td>
                          <td>{book.title}</td>
                          <td><FaStar color="#FFD700" /> {avgRating}</td>
                          <td>
                              <button className="table-icon edit" onClick={() => { setEditBookData(book); setIsEditModalOpen(true); }}><FaEdit /></button>
                              <button className="table-icon delete" onClick={() => setDeleteConfig({isOpen: true, type: "book", id: book.id, name: book.title})}><FaTrash /></button>
                          </td>
                      </tr>
                    )
                })}</tbody>
              </table>
            </div>
          )}

          {activeSection === "trending" && (
             <div className="table-container">
               <div className="section-header"><h2>Trending Management</h2></div>
               <table className="admin-table">
                 <thead><tr><th>Book Title</th><th>Rating</th><th>Trending Status</th></tr></thead>
                 <tbody>{books.map(book => {
                    const bookReviews = reviews.filter(r => r.book_id === book.id || r.BookId === book.id);
                    const avgRating = bookReviews.length > 0 
                      ? (bookReviews.reduce((sum, r) => sum + Number(r.rating), 0) / bookReviews.length).toFixed(1)
                      : "0.0";

                    return (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{avgRating} ⭐</td>
                        <td>
                          <button className={`trending-toggle-btn ${book.is_trending ? 'active' : ''}`} onClick={() => handleToggleTrending(book)}>
                            {book.is_trending ? "Remove from Trending" : "Add to Trending"}
                          </button>
                        </td>
                      </tr>
                    )
                  })}</tbody>
               </table>
             </div>
          )}

          {activeSection === "reviews" && (
            <div className="table-container">
              <div className="section-header"><h2>Review Moderation</h2></div>
              <table className="admin-table">
                <thead><tr><th>Book</th><th>User</th><th>Rating</th><th className="comment-header">Full Review</th><th>Actions</th></tr></thead>
                <tbody>{reviews.map(review => (<tr key={review.id}><td><strong>{review.Book?.title}</strong></td><td>@{review.User?.username}</td><td><FaStar color="#FFA000" /> {review.rating}</td><td className="comment-cell-full">{review.comment}</td><td><button className="table-icon delete" onClick={() => setDeleteConfig({isOpen: true, type: "review", id: review.id, name: "this review"})}><FaTrash /></button></td></tr>))}</tbody>
              </table>
            </div>
          )}

          {activeSection === "categories" && (
            <div className="table-container">
              <div className="section-header"><h2>Genre Management</h2><button className="add-btn-primary" onClick={() => setIsCategoryModalOpen(true)}><FaPlus /> Add Category</button></div>
              <table className="admin-table">
                <thead><tr><th>Genre Name</th><th>Actions</th></tr></thead>
                <tbody>{categories.map((cat) => (<tr key={cat.id}><td><span className="pill-category">{cat.name}</span></td><td><button className="table-icon delete" onClick={() => setDeleteConfig({isOpen: true, type: "category", id: cat.id, name: cat.name})}><FaTrash /></button></td></tr>))}</tbody>
              </table>
            </div>
          )}

          {activeSection === "users" && (
            <div className="table-container">
              <div className="section-header"><h2>User Management</h2></div>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>{users.map(user => (<tr key={user.id}><td>#{user.id}</td><td>{user.username}</td><td>{user.email}</td><td><span className="pill-category">{user.role}</span></td><td><button className="table-icon delete" onClick={() => setDeleteConfig({isOpen: true, type: "user", id: user.id, name: user.username})}><FaTrash /></button></td></tr>))}</tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <AddBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={loadData} 
        categories={categories} 
      />
      
      <EditBookModal 
        key={editBookData?.id || 'new-edit'} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onRefresh={loadData} 
        book={editBookData} 
        categories={categories} 
      />

      <AddCategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onRefresh={loadData} 
      /> 

      <DeleteConfirmModal 
        isOpen={deleteConfig.isOpen} 
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })} 
        onConfirm={handleConfirmDelete} 
        itemName={deleteConfig.name} 
      />
    </div>
  );
};

export default AdminDashboard;