const { Review, User, Book } = require("../models");

// ✅ FIXED: Admin handler to see all reviews across the platform
exports.getAllReviewsAdmin = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: Book, attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error("Admin Review Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch all reviews" });
    }
};

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

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findByPk(reviewId);

    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.update({ rating, comment });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if (!review) return res.status(404).json({ message: "Review not found" });

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