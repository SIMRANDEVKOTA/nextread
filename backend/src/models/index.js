const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// 1. Initialize Models
const User = require("./User")(sequelize, DataTypes);
const Book = require("./Book")(sequelize, DataTypes);
const Review = require("./Review")(sequelize, DataTypes);
const UserBooks = require("./UserBooks")(sequelize, DataTypes);
const Library = require("./Library")(sequelize, DataTypes); // ✅ FIXED
const Category = require("./Category")(sequelize, DataTypes); // ✅ FIXED

// 2. Define Relationships
User.belongsToMany(Book, { through: UserBooks, foreignKey: "UserId" });
Book.belongsToMany(User, { through: UserBooks, foreignKey: "BookId" });

UserBooks.belongsTo(User, { foreignKey: "UserId" });
UserBooks.belongsTo(Book, { foreignKey: "BookId" });

User.hasMany(Review, { foreignKey: "UserId" });
Review.belongsTo(User, { foreignKey: "UserId" });

Book.hasMany(Review, { foreignKey: "BookId" });
Review.belongsTo(Book, { foreignKey: "BookId" });

User.hasMany(Library, { foreignKey: "UserId" });
Library.belongsTo(User, { foreignKey: "UserId" });
Book.hasMany(Library, { foreignKey: "BookId" });
Library.belongsTo(Book, { foreignKey: "BookId" });

// 3. Export
module.exports = {
  sequelize,
  User,
  Book,
  Review,
  UserBooks,
  Library,
  Category,
};