import ZeoliteExtension from "../core/ZeoliteExtension";
import { Sequelize, Model } from "sequelize-typescript";
import path from "path";
import config from "../../config.json";

export default class DatabaseExtension extends ZeoliteExtension {
  name = "database";
  sequelize: Sequelize;

  async onLoad() {
    this.sequelize = new Sequelize(config.dbUri);
    this.sequelize.addModels([ path.join(__dirname, "..", "dbModels") ]);

    this.client.once("ready", () => this.sequelize.sync()
      .then(() => this.client.logger.info("DB: connected.")))
  }
}