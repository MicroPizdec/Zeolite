const Logger = require("../core/Logger");
const Sequelize = require("sequelize");
const initDB = require("../core/initDB");

module.exports.load = async client => {
  const databaseLogger = new Logger(Logger.INFO, "Database");

  global.sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    storage: config.database.storage,
    dialectOptions: { timezone: "Etc/GMT0" },
    logging: (...msg) => databaseLogger.debug(msg),
  });

  global.db = initDB(sequelize, Sequelize.DataTypes);

  await sequelize.sync()
    .then(() => databaseLogger.info("Connected successfully to the database."))
    .catch(err => databaseLogger.error(`Failed to connect to the database:\n${err.stack}`));
    
  client.on("guildDelete", async guild => {
    await warns.destroy({ where: { server: guild.id } });
    await prefixes.destroy({ where: { server: guild.id } });
    await tags.destroy({ where: { server: guild.id } });
    await languages.destroy({ where: { server: guild.id } });
  });
}