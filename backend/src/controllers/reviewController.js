const { Review, User, Book } = require("../models");

exports.getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.findAll({
      where: { BookId: bookId },
      include: [
        { model: User, attributes: ["username"] },
        { model: Book, attributes: ["title", "cover"] } 
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; 

    const review = await Review.create({
      rating,
      comment,
      BookId: bookId,
      UserId: userId,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};

// ✅ FIXED: Added Update function to handle Edit clicks
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findByPk(reviewId);

    if (!review || review.UserId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this review" });
    }

    await review.update({ rating, comment });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

// ✅ FIXED: Added Delete function to handle Trash clicks
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if (!review || review.UserId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    await review.destroy();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Book, attributes: ["title", "cover", "id"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user reviews", error: error.message });
  }
};