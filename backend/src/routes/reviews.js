const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Get all reviews for the logged-in user
router.get("/user/my-reviews", authMiddleware, reviewController.getUserReviews);

// ✅ FIXED: Admin route to fetch all reviews across the platform
router.get("/admin/all", authMiddleware, adminMiddleware, reviewController.getAllReviewsAdmin);

// Public routes
router.get("/:bookId", reviewController.getReviewsByBook);

// Protected routes
router.post("/:bookId", authMiddleware, reviewController.addReview);
router.put("/:reviewId", authMiddleware, reviewController.updateReview);
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);

module.exports = router;