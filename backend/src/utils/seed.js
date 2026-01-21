const { sequelize, Book } = require('../models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); 
    console.log("✅ Database Tables Re-Created!");

    const books = [
      {
        title: "It Ends With Us",
        author: "Colleen Hoover",
        genre: "Romance",
        description: "A brave and heartbreaking novel...",
        pages: 384, // ✅ Added pages
        rating: 4.5,
        cover: "ends.jpeg", 
        is_recommended: true
      },
      {
        title: "The Cruel Prince",
        author: "Holly Black",
        genre: "Fantasy",
        description: "Of course I want to be like them...",
        pages: 370, // ✅ Added pages
        rating: 4.1,
        cover: "cruel.jpg", 
        is_recommended: true
      },
      {
        title: "Powerless",
        author: "Lauren Roberts",
        genre: "Fantasy",
        description: "She is the very thing he’s spent...",
        pages: 528, // ✅ Added pages
        rating: 4.2,
        cover: "powerless.webp", 
        is_recommended: false
      },
      {
        title: "The Housemaid",
        author: "Freida McFadden",
        genre: "Thriller",
        description: "Every day I clean the Winchesters' beautiful house...",
        pages: 336, // ✅ Added pages
        rating: 4.5,
        cover: "housemaid.jpeg",
        is_recommended: false
      },
      {
        title: "Twisted Love",
        author: "Ana Huang",
        genre: "Romance",
        description: "He has a heart of ice...",
        pages: 358, // ✅ Added pages
        rating: 4.0,
        cover: "twisted.jpg",
        is_recommended: false
      }
    ];

    await Book.bulkCreate(books);
    console.log("✅ Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();