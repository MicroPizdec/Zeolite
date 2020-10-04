module.exports = (sequelize, DataTypes) => {
  return sequelize.define("disabledCmds", {
    name: DataTypes.STRING,
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, { timestamps: false });
}
