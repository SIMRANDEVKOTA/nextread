const { Category, Book } = require("../models");

exports.getAllCategories = async (req, res) => {
  try {
    const existingBookGenres = await Book.findAll({
      attributes: [[Book.sequelize.fn('DISTINCT', Book.sequelize.col('genre')), 'genre']],
      raw: true
    });

    for (let item of existingBookGenres) {
      if (item.genre) {
        await Category.findOrCreate({ where: { name: item.genre } });
      }
    }

    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (error) {
    console.error("Migration Error:", error);
    res.status(500).json({ message: "Failed to sync existing genres" });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Category already exists" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};