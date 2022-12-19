import { ZeoliteExtension } from 'zeolitecore';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { getLogger, Logger } from 'log4js';

export default class DatabaseExtension extends ZeoliteExtension {
  name = 'database';
  public sequelize: Sequelize;
  private logger: Logger;

  public async onLoad() {
    this.logger = getLogger('Database');

    this.sequelize = new Sequelize(config.dbUri || 'sqlite:bot.db', {
      logging: (msg) => this.logger.trace(msg),
    });
    this.sequelize.addModels([path.join(__dirname, '..', 'dbModels')]);

    await this.sequelize
      .sync()
      .then(() => this.logger.info('Connected to DB.'))
      .catch((err) => this.logger.error(`Failed to connect to DB:\n${err.stack}`));
  }
}
