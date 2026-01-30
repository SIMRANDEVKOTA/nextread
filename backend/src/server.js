require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const path = require('path'); // ✅ ADDED: Required for directory paths
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const libraryRoutes = require("./routes/library");
const reviewRoutes = require("./routes/reviews"); 
const categoryRoutes = require("./routes/categories");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ FIXED: Static folder setup to serve images from backend/public/images
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes); 
app.use("/api/library", libraryRoutes);
app.use("/api/reviews", reviewRoutes); 
app.use("/api/categories", categoryRoutes);
// ✅ FIXED: Correct path to serve images from backend/public/images
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Book Review API Running" });
});

// Start server
const PORT = process.env.PORT || 6060;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is permanently running on port ${PORT}`);
  });
}).catch(err => {
  console.error("❌ Database sync failed:", err);
});

module.exports = app;