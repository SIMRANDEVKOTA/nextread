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

/* ---------- REVIEWS ---------- */

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const bookId = req.params.id;

    const review = await Review.create({
      rating,
      comment,
      UserId: userId,
      BookId: bookId,
    });

    await recalcBookRating(bookId);

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

// Get all reviews by the logged-in user
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.findAll({
      where: { UserId: userId },
      include: {
        model: Book,
        attributes: ["id", "title", "author", "cover"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all unique genres
exports.getGenres = async (req, res) => {
  try {
    const genres = await Book.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("genre")), "genre"]],
      where: {
        genre: { [Op.ne]: null },
      },
      raw: true,
    });

    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ FIXED: Standardized Genre Recommendations to avoid blank pages
exports.getRecommendations = async (req, res) => {
  try {
    const { genre, limit = 10 } = req.query;

    if (!genre || genre === "All") {
      const books = await Book.findAll({ limit: parseInt(limit) });
      return res.json(books);
    }

    const books = await Book.findAll({
      where: { genre: { [Op.iLike]: genre } },
      limit: parseInt(limit),
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- HELPER ---------- */
async function recalcBookRating(bookId) {
  const reviews = await Review.findAll({ where: { BookId: bookId } });
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  await Book.update(
    { rating: Number(avg.toFixed(1)) },
    { where: { id: bookId } }
  );
}