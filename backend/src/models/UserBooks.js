module.exports = (sequelize, DataTypes) => {
  const UserBooks = sequelize.define("UserBooks", {
    status: {
      type: DataTypes.STRING,
      defaultValue: "to-read",
    },
    currentPage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalPages: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });

  return UserBooks;
};