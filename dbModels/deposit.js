module.exports = (sequelize, DataTypes) =>
  sequelize.define("deposit", {
    user: DataTypes.STRING,
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });
