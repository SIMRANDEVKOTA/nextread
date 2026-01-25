// backend/src/controllers/adminController.js
const { Book, User, Review } = require('../models');

// Get all stats for the Admin Dashboard overview
exports.getDashboardStats = async (req, res) => {
    try {
        const bookCount = await Book.count();
        const userCount = await User.count();
        const reviewCount = await Review.count();
        res.json({ books: bookCount, users: userCount, reviews: reviewCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

// Manage Books: Add a new book to NextRead
exports.addBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: "Error adding book" });
    }
};