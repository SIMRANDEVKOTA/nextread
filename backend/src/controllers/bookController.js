const { Book, Review, User, sequelize } = require("../models");
const { Op } = require("sequelize");

// ✅ Editor's Pick — EXACTLY 2
exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { is_recommended: true },
      limit: 2,
      order: [["id", "ASC"]],
    });
    res.json(books);
  } catch {
    res.status(500).json({ message: "Failed to fetch featured books" });
  }
};

// ✅ Trending Now — EXACTLY 3
exports.getPopularBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [["rating", "DESC"]],
      limit: 3,
    });
    res.json(books);
  } catch {
    res.status(500).json({ message: "Failed to fetch popular books" });
  }
};

/* ---------- RECOMMEND / SEARCH / GENRES ---------- */

exports.getAllBooks = async (req, res) => {
  try {
    const { genre, search } = req.query;
    const where = {};
    if (genre && genre !== "All") {
      where.genre = { [Op.iLike]: genre };
    }
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
    const books = await Book.findAll({ where });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

/* ---------- ADMIN STATS (Requirement #3) ---------- */

// ✅ FIXED: Using sequelize.models to ensure 'Library' is accessed correctly
exports.getAdminStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalUsers = await User.count();
    
    // Counting 'Reading Now' from the library table status
    const activeReaders = await sequelize.models.Library.count({
      where: { status: 'Reading' }
    });

    res.json({
      totalBooks,
      totalUsers,
      activeReaders
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

/* ---------- BOOK DETAILS ---------- */

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(500).json({ message: "Error fetching book" });
  }
};

/* ---------- ADMIN ACTIONS (DELETE & UPDATE) ---------- */

// ✅ FIXED: Specific handler for Admin book update
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.update(req.body);
    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error during book update" });
  }
};

// ✅ FIXED: handler function for Admin book deletion
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.destroy();
    res.json({ message: "Book deleted successfully from database" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

/* ---------- REVIEWS ---------- */

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      rating, comment, UserId: req.user.id, BookId: req.params.id,
    });
    await recalcBookRating(req.params.id);
    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json(fullReview);
  } catch {
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByPk(req.params.reviewId);
    if (!review || review.UserId !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    review.rating = rating;
    review.comment = comment;
    await review.save();
    await recalcBookRating(review.BookId);
    res.json(review);
  } catch {
    res.status(500).json({ message: "Failed to update review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review || review.UserId !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const bookId = review.BookId;
    await review.destroy();
    await recalcBookRating(bookId);
    res.json({ message: "Review deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete review" });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { UserId: req.user.id },
      include: { model: Book, attributes: ["id", "title", "author", "cover"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await Book.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("genre")), "genre"]],
      where: { genre: { [Op.ne]: null } },
      raw: true,
    });
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { genre, limit = 10 } = req.query;
    const where = genre && genre !== "All" ? { genre: { [Op.iLike]: genre } } : {};
    const books = await Book.findAll({ where, limit: parseInt(limit) });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- HELPER ---------- */
async function recalcBookRating(bookId) {
  const reviews = await Review.findAll({ where: { BookId: bookId } });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
  await Book.update({ rating: Number(avg.toFixed(1)) }, { where: { id: bookId } });
}