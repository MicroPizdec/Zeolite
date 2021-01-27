module.exports = (sequelize, DataTypes) => 
  sequelize.define("embColors", {
    user: DataTypes.STRING,
    color: DataTypes.INTEGER,
    isRandom: DataTypes.BOOLEAN,
  }, { timestamps: false });