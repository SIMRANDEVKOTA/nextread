module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    cover: {
      type: DataTypes.STRING,
    },
    // ✅ ADDED: This fixes the 500 Error in Library/Profile tracking
    pages: {
      type: DataTypes.INTEGER,
      defaultValue: 300,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    is_recommended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Book;
};