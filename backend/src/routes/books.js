const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Public routes
router.get("/", bookController.getAllBooks);
router.get("/genres", bookController.getGenres);
router.get("/recommendations", bookController.getRecommendations);

// ✅ FIXED: Admin Stats MUST be above parametric /:id route
router.get("/admin/stats", authMiddleware, adminMiddleware, bookController.getAdminStats);

router.get("/reviews/user", authMiddleware, bookController.getUserReviews);
router.get("/:id", bookController.getBookById);

// Protected routes
router.post("/:id/reviews", authMiddleware, bookController.addReview);
router.put("/reviews/:reviewId", authMiddleware, bookController.updateReview);
router.delete("/reviews/:reviewId", authMiddleware, bookController.deleteReview);

// ✅ FIXED: Admin Protected routes
router.put("/:id", authMiddleware, adminMiddleware, bookController.updateBook);
router.delete("/:id", authMiddleware, adminMiddleware, bookController.deleteBook);

module.exports = router;