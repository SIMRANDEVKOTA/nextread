module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowChild: false,
      unique: true,
    },
  });
  return Category;
};