import ZeoliteExtension from "../core/ZeoliteExtension";
import { Sequelize, Model } from "sequelize-typescript";
import path from "path";
import Logger, { LoggerLevel } from "../core/Logger";

export default class DatabaseExtension extends ZeoliteExtension {
  name = "database";
  sequelize: Sequelize;
  logger = new Logger(LoggerLevel.Info, "DatabaseExtension");

  async onLoad() {
    this.sequelize = new Sequelize(config.dbUri || "sqlite:bot.db", {
      logging: false,
    });
    this.sequelize.addModels([ path.join(__dirname, "..", "dbModels") ]);

    this.client.once("ready", () => {
      this.sequelize.sync()
        .then(() => this.logger.info("DB: connected."))
        .catch(err => this.logger.error(`DB: failed to connect:\n${err.stack}`));
    });
  }
}