const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// 1. Initialize Models
const User = require("./User")(sequelize, DataTypes);
const Book = require("./Book")(sequelize, DataTypes);
const Review = require("./Review")(sequelize, DataTypes);
const UserBooks = require("./UserBooks")(sequelize, DataTypes);

// 2. Define Relationships

// Many-to-Many: Users <-> Books via UserBooks
User.belongsToMany(Book, { through: UserBooks, foreignKey: "UserId" });
Book.belongsToMany(User, { through: UserBooks, foreignKey: "BookId" });

// ✅ REQUIRED for getLibrary: Allows UserBooks to access Book details
UserBooks.belongsTo(User, { foreignKey: "UserId" });
UserBooks.belongsTo(Book, { foreignKey: "BookId" });

// ✅ REQUIRED for Reviews: Connects Users and Books to Reviews
// This allows the Review page to show "Written by: [Username]"
User.hasMany(Review, { foreignKey: "UserId" });
Review.belongsTo(User, { foreignKey: "UserId" });

Book.hasMany(Review, { foreignKey: "BookId" });
Review.belongsTo(Book, { foreignKey: "BookId" });

// 3. Export
module.exports = {
  sequelize,
  User,
  Book,
  Review,
  UserBooks,
};