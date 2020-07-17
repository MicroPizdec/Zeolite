module.exports = (sequelize, DataTypes) => {
  return sequelize.define("languages", {
    server: DataTypes.STRING,
    language: {
      type: DataTypes.STRING,
      defaultValue: "en",
    },
  });
}
