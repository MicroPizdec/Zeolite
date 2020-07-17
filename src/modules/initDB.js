const fs = require("fs");

module.exports = (sequelize, DataTypes) => {
  let files = fs.readdirSync("./src/dbModels").filter(f => f.endsWith(".js"));

  for (let file of files) {
    let model = require(`../dbModels/${file}`)(sequelize, DataTypes);
    global[model.name] = model;
  }
}
