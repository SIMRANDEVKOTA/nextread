module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      profileImage: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Review, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.UserBooks, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
    });
  };

  return User;
};