module.exports = (sequelize, DataTypes) =>
  sequelize.define("tags", {
    server: DataTypes.STRING,
    author: DataTypes.STRING,
    name: DataTypes.STRING,
    text: DataTypes.TEXT,
    isGlobal: DataTypes.BOOLEAN,
  });