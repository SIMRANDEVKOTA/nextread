import React, { useState, useEffect, useCallback } from "react";
import { 
  FaThLarge, FaBookOpen, FaTags, FaUsers, FaSignOutAlt, 
  FaPlus, FaCheckCircle, FaTrash, FaEdit 
} from "react-icons/fa";
import { 
  fetchAllBooks, fetchAllUsers, deleteBook, deleteUser, fetchAdminStats 
} from "../../services/api"; 
import { useToast } from "../../context/ToastContext";
import AddBookModal from "../../components/AddBookModal"; 
import EditBookModal from "../../components/EditBookModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal"; 
import "../../css/admin.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, activeReaders: 0 });
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBookData, setEditBookData] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, type: "", id: null, name: "" });

  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ FIXED: Parallel load including Admin Stats
      const [bookRes, userRes, statsRes] = await Promise.all([
        fetchAllBooks(), 
        fetchAllUsers(),
        fetchAdminStats()
      ]);
      setBooks(bookRes.data);
      setUsers(userRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      showToast("System error: Could not sync admin data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const openDeleteModal = (type, id, name) => {
    setDeleteConfig({ isOpen: true, type, id, name });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfig.type === "book") {
        await deleteBook(deleteConfig.id);
      } else {
        await deleteUser(deleteConfig.id);
      }
      showToast(`${deleteConfig.type === "book" ? "Book" : "User"} deleted successfully`, "success");
      loadData(); 
    } catch (error) {
      console.error("Delete failed:", error);
      showToast(`Error deleting ${deleteConfig.type}`, "error");
    } finally {
      setDeleteConfig({ isOpen: false, type: "", id: null, name: "" });
    }
  };

  const handleEditClick = (book) => {
    setEditBookData(book);
    setIsEditModalOpen(true);
  };

  if (loading) return <div className="loader">Initializing Admin Panel...</div>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">NR</span>
          <h2>Admin Panel</h2>
        </div>
        <nav>
          <button className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}>
            <FaThLarge /> Overview
          </button>
          <button className={activeSection === "books" ? "active" : ""} onClick={() => setActiveSection("books")}>
            <FaBookOpen /> Book Management
          </button>
          <button className={activeSection === "categories" ? "active" : ""} onClick={() => setActiveSection("categories")}>
            <FaTags /> Categories
          </button>
          <button className={activeSection === "users" ? "active" : ""} onClick={() => setActiveSection("users")}>
            <FaUsers /> User Management
          </button>
        </nav>
        <button className="logout-nav" onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-top-bar">
          <h3>{activeSection.toUpperCase()}</h3>
          <div className="admin-user-info">Logged in as: <strong>Admin</strong></div>
        </header>

        <section className="admin-view-content">
          {activeSection === "overview" && (
            <div className="stats-grid">
              <div className="stat-card"><h3>{stats.totalBooks}</h3><p>Books</p></div>
              <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Registered Users</p></div>
              <div className="stat-card"><h3>{stats.activeReaders}</h3><p>Reading Now</p></div>
            </div>
          )}

          {activeSection === "books" && (
            <div className="table-container">
              <div className="section-header">
                <h2>Manage Books</h2>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                  <FaPlus /> Add New Book
                </button>
              </div>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Title</th><th>Genre</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id}>
                      <td>#{book.id}</td>
                      <td>{book.title}</td>
                      <td><span className="pill-category">{book.genre}</span></td>
                      <td><span className="status-live"><FaCheckCircle /> Published</span></td>
                      <td>
                        <button className="table-icon edit" onClick={() => handleEditClick(book)}><FaEdit /></button>
                        <button className="table-icon delete" onClick={() => openDeleteModal("book", book.id, book.title)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "categories" && (
            <div className="table-container">
              <div className="section-header">
                <h2>Genre Management</h2>
                <button className="add-btn" onClick={() => showToast("Add Category coming soon!", "info")}>
                  <FaPlus /> Add New Category
                </button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Genre Name</th><th>Actions</th></tr></thead>
                <tbody>
                  {[...new Set(books.map(b => b.genre))].map((genre, idx) => (
                    <tr key={idx}>
                      <td><span className="pill-category">{genre}</span></td>
                      <td>
                        <button className="table-icon edit"><FaEdit /></button>
                        <button className="table-icon delete" onClick={() => openDeleteModal("category", idx, genre)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "users" && (
            <div className="table-container">
              <div className="section-header"><h2>User Management</h2></div>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td><span className="pill-category">{user.role}</span></td>
                      <td>
                        <button className="table-icon edit"><FaEdit /></button>
                        <button className="table-icon delete" onClick={() => openDeleteModal("user", user.id, user.username)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <AddBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={loadData} />
      
      {/* ✅ FIXED: Key Pattern forces clean state reset */}
      <EditBookModal 
        key={editBookData?.id || 'new-edit'}
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onRefresh={loadData}
        book={editBookData}
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