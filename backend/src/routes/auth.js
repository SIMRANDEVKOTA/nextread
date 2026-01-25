const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.get("/users", authMiddleware, authController.getAllUsers);

// ✅ FIXED: Added Admin route to delete a user
router.delete("/users/:id", authMiddleware, authController.deleteUser);

module.exports = router;