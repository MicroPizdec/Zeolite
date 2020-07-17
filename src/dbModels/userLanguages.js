module.exports = (sequelize, DataTypes) => {
  return sequelize.define("userLanguages", {
    user: DataTypes.STRING,
    language: {
      type: DataTypes.STRING,
      defaultValue: "en",
    },
    overriden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, { timestamps: false });
}
