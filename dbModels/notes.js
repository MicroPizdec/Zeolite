module.exports = (sequelize, DataTypes) => {
  return sequelize.define("notes", {
    name: {
      type: DataTypes.TEXT,
    },
    content: DataTypes.TEXT,
    author: DataTypes.STRING,
  }, { timestamps: false });
}
