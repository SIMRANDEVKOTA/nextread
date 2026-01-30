module.exports = (sequelize, DataTypes) => {
  const Library = sequelize.define("Library", {
    status: {
      type: DataTypes.ENUM("Plan to Read", "Reading", "Completed", "Dropped"),
      defaultValue: "Plan to Read",
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Library;
};