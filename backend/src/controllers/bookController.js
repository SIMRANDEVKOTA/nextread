const { Book, Review, User, Library, sequelize } = require("../models");
const { Op } = require("sequelize");

/* ---------- RECALC RATING HELPER ---------- */

async function recalcBookRating(bookId) {
  const reviews = await Review.findAll({ where: { BookId: bookId } });

  const average = reviews.length > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 0.0;

  await Book.update({ rating: average }, { where: { id: bookId } });
  console.log(`Rating updated: Book ${bookId} → ${average}`);
}

/* ---------- ADMIN STATS ---------- */

exports.getAdminStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalUsers = await User.count();
    const totalReviews = await Review.count();
    res.json({ totalBooks, totalUsers, totalReviews });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

/* ---------- FEATURED BOOKS ---------- */

exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { is_recommended: true },
      limit: 2,
      order: [["id", "ASC"]],
    });
    res.json(books);
  } catch (err) {
    console.error("Featured Books Error:", err);
    res.status(500).json({ message: "Failed to fetch featured books" });
  }
};

/* ---------- POPULAR / TRENDING BOOKS (🔥 FIXED) ---------- */

exports.getPopularBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { is_trending: true },   // ⚠️ Must exist in DB
      limit: 5,
      order: [["rating", "DESC"]],
    });

    res.json(books);
  } catch (err) {
    console.error("Popular Books Error:", err); // ✅ Log real error
    res.status(500).json({ message: "Error loading trending books" });
  }
};

/* ---------- ALL BOOKS ---------- */

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

    const books = await Book.findAll({
      where,
      order: [["id", "DESC"]],
    });

    res.json(books);
  } catch (err) {
    console.error("All Books Error:", err);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

/* ---------- SINGLE BOOK ---------- */

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{ model: Review, include: [{ model: User, attributes: ["username"] }] }],
    });

    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book" });
  }
};

/* ---------- ADMIN ACTIONS ---------- */

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, coverImage } = req.body;

    const newBook = await Book.create({
      title,
      author,
      genre,
      description,
      cover: coverImage,
      rating: 0,
      is_recommended: false,
      is_trending: false,
    });

    res.status(201).json(newBook);
  } catch (err) {
    console.error("Add Book Error:", err);
    res.status(500).json({ message: "Failed to add book" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.update(req.body);
    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- REVIEWS ---------- */

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.create({
      rating: Number(rating),
      comment,
      UserId: req.user.id,
      BookId: req.params.id,
    });

    await recalcBookRating(req.params.id);

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ["username"] }],
    });

    res.json(fullReview);
  } catch (err) {
    console.error("Add Review Error:", err);
    res.status(500).json({ message: "Failed to add review" });
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
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};

/* ---------- USER REVIEWS ---------- */

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

/* ---------- GENRES ---------- */

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

/* ---------- RECOMMENDATIONS ---------- */

exports.getRecommendations = async (req, res) => {
  try {
    const { genre, limit = 10 } = req.query;
    const where = genre && genre !== "All" ? { genre: { [Op.iLike]: genre } } : {};

    const books = await Book.findAll({
      where,
      limit: parseInt(limit),
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
