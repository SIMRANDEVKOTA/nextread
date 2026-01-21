const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all reviews for the logged-in user
router.get("/user/my-reviews", authMiddleware, reviewController.getUserReviews);

// Get all reviews for a specific book
router.get("/:bookId", reviewController.getReviewsByBook);

// Add a new review (requires login)
router.post("/:bookId", authMiddleware, reviewController.addReview);

// ✅ FIXED: Added Update Route
router.put("/:reviewId", authMiddleware, reviewController.updateReview);

// ✅ FIXED: Added Delete Route
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);

module.exports = router;