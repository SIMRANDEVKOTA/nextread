const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", bookController.getAllBooks);
router.get("/genres", bookController.getGenres);
router.get("/recommendations", bookController.getRecommendations);

// User reviews must be ABOVE /:id so Express doesn't think "user" is an ID
router.get("/reviews/user", authMiddleware, bookController.getUserReviews);

router.get("/:id", bookController.getBookById);

// Protected routes
router.post("/:id/reviews", authMiddleware, bookController.addReview);
router.put("/reviews/:reviewId", authMiddleware, bookController.updateReview);
router.delete("/reviews/:reviewId", authMiddleware, bookController.deleteReview);

module.exports = router;