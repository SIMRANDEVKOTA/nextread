module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    }
  });

  return Review;
};