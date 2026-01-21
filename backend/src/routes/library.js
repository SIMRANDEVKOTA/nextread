const express = require("express");
const libraryController = require("../controllers/libraryController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// All library routes require authentication
router.post("/add", authMiddleware, libraryController.addToLibrary);
router.get("/", authMiddleware, libraryController.getLibrary);
router.get("/stats", authMiddleware, libraryController.getLibraryStats);
router.put("/:bookId/progress", authMiddleware, libraryController.updateProgress);
router.put("/:bookId/status", authMiddleware, libraryController.updateStatus);
router.delete("/:bookId", authMiddleware, libraryController.deleteFromLibrary);

module.exports = router;