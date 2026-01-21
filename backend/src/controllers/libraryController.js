const { UserBooks, Book } = require("../models");

exports.addToLibrary = async (req, res) => {
  try {
    const { bookId, status } = req.body;
    const userId = req.user.id;

    const existing = await UserBooks.findOne({
      where: { UserId: userId, BookId: bookId },
    });

    if (existing) {
      return res.status(400).json({ message: "Book already in library" });
    }

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userBook = await UserBooks.create({
      UserId: userId,
      BookId: bookId,
      status: status || "to-read",
      totalPages: book.pages || 300,
    });

    res.json(userBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLibrary = async (req, res) => {
  try {
    const userId = req.user.id;

    const library = await UserBooks.findAll({
      where: { UserId: userId },
      include: {
        model: Book,
        attributes: ["id", "title", "author", "cover", "pages", "genre"],
      },
      order: [["updatedAt", "DESC"]],
    });

    res.json(library);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { currentPage } = req.body;
    const userId = req.user.id;

    const userBook = await UserBooks.findOne({
      where: { UserId: userId, BookId: bookId },
    });

    if (!userBook) return res.status(404).json({ message: "Book not found" });

    await userBook.update({ currentPage });
    res.json(userBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const userBook = await UserBooks.findOne({
      where: { UserId: userId, BookId: bookId },
    });

    if (!userBook) return res.status(404).json({ message: "Book not found" });

    const updates = { status };
    if (status === "currently-reading" && !userBook.startedAt) {
      updates.startedAt = new Date();
    }
    if (status === "completed") {
      updates.completedAt = new Date();
    }

    await userBook.update(updates);
    res.json(userBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFromLibrary = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    await UserBooks.destroy({
      where: { UserId: userId, BookId: bookId },
    });

    res.json({ message: "Book removed from library" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLibraryStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await UserBooks.findAll({
      where: { UserId: userId },
      attributes: ["status"],
      raw: true,
    });

    const toRead = stats.filter((s) => s.status === "to-read").length;
    const reading = stats.filter((s) => s.status === "currently-reading").length;
    const completed = stats.filter((s) => s.status === "completed").length;

    res.json({ toRead, reading, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};