module.exports = (sequelize, DataTypes) => {
  return sequelize.define("commandBans", {
    user: DataTypes.STRING,
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reason: DataTypes.TEXT,
  }, { timestamps: false });
}
