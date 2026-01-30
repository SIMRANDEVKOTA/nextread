const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

/* ---------- ADMIN ROUTES (Must come before /:id) ---------- */

router.get("/admin/stats", authMiddleware, adminMiddleware, bookController.getAdminStats);

/* ---------- PUBLIC ROUTES ---------- */

router.get("/featured", bookController.getFeaturedBooks);
router.get("/popular", bookController.getPopularBooks);
router.get("/genres", bookController.getGenres);
router.get("/recommendations", bookController.getRecommendations);
router.get("/", bookController.getAllBooks);

/* ---------- PROTECTED USER ROUTES (⚠️ MUST BE BEFORE :id) ---------- */

router.get("/reviews/user", authMiddleware, bookController.getUserReviews);
router.post("/:id/reviews", authMiddleware, bookController.addReview);
router.delete("/reviews/:reviewId", authMiddleware, bookController.deleteReview);

/* ---------- SINGLE BOOK (⚠️ KEEP THIS LAST) ---------- */

router.get("/:id", bookController.getBookById);

/* ---------- ADMIN ACTIONS ---------- */

router.post("/", authMiddleware, adminMiddleware, bookController.addBook);
router.put("/:id", authMiddleware, adminMiddleware, bookController.updateBook);
router.delete("/:id", authMiddleware, adminMiddleware, bookController.deleteBook);

module.exports = router;
