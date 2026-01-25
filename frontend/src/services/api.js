import axios from "axios";

const API_BASE = "http://localhost:6060/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH ---
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data) => api.put("/auth/profile", data);
export const fetchAllUsers = () => api.get("/auth/users");
export const deleteUser = (userId) => api.delete(`/auth/users/${userId}`);

// --- BOOKS ---
export const fetchAllBooks = () => api.get("/books");
export const createBook = (data) => api.post("/books", data); 
export const updateBook = (bookId, data) => api.put(`/books/${bookId}`, data);
export const deleteBook = (bookId) => api.delete(`/books/${bookId}`); 
export const fetchBookDetails = (id) => api.get(`/books/${id}`);
export const getRecommendations = (genre) =>
  api.get(`/books/recommendations?genre=${genre}`);
export const getGenres = () => api.get("/books/genres");
// ✅ ADDED: Service for Requirement #3 Stats
export const fetchAdminStats = () => api.get("/books/admin/stats");

// --- REVIEWS ---
export const getReviews = (bookId) => api.get(`/reviews/${bookId}`);
export const addReview = (bookId, data) => api.post(`/reviews/${bookId}`, data);
export const updateReview = (reviewId, data) => api.put(`/reviews/${reviewId}`, data);
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);
export const getUserReviews = () => api.get("/reviews/user/my-reviews");

// --- LIBRARY ---
export const getMyLibrary = () => api.get("/library");
export const addToLibrary = (data) => api.post("/library/add", data);
export const removeFromLibrary = (bookId) => api.delete(`/library/${bookId}`);
export const updateBookStatus = (bookId, status) => 
  api.put(`/library/${bookId}/status`, { status });
export const updateProgress = (bookId, data) =>
  api.put(`/library/${bookId}/progress`, data);
export const getLibraryStats = () => api.get("/library/stats");

export default api;