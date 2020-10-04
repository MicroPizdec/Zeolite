module.exports = (sequelize, dataTypes) => {
  return sequelize.define("zetCoins", {
    user: dataTypes.STRING,
    balance: {
      type: dataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    banned: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    reason: dataTypes.TEXT,
  }, { timestamps: false });
}

