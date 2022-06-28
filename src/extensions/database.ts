import { ZeoliteExtension, ZeoliteLogger, LoggerLevel, ZeoliteContext } from 'zeolitecore';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

declare global {
  var a: number;
}

export default class DatabaseExtension extends ZeoliteExtension {
  name = 'database';
  public sequelize: Sequelize;
  private logger: ZeoliteLogger = new ZeoliteLogger(LoggerLevel.Info, 'Database');

  public async onLoad() {
    this.sequelize = new Sequelize(config.dbUri || 'sqlite:bot.db', {
      logging: false,
    });
    this.sequelize.addModels([path.join(__dirname, '..', 'dbModels')]);

    this.sequelize
      .sync()
      .then(() => this.logger.info('Connected to DB.'))
      .catch((err) => this.logger.error(`Failed to connect to DB:\n${err.stack}`));

    this.client.addMiddleware(async (ctx: ZeoliteContext, next) => {
      if (!this.client.localization.userLanguages[(ctx.member || ctx.user!).id]) {
        const lang = await this.sequelize.models.Languages.findOrCreate({
          where: { userID: (ctx.member || ctx.user!).id },
        }).then((l) => l[0]);
        this.client.localization.userLanguages[(ctx.member || ctx.user!).id] = lang.getDataValue('language');
      }

      await next();
    });

    this.client.addMiddleware(async (ctx: ZeoliteContext, next) => {
      const color = await this.sequelize.models.EmbedColors.findOne({
        where: { userID: (ctx.member || ctx.user!).id },
      });

      ctx.set(
        'embColor',
        color
          ? color.getDataValue('random')
            ? Math.round(Math.random() * 16777216)
            : color.getDataValue('color') || config.defaultColor || 0x9f00ff
          : config.defaultColor || 0x9f00ff,
      );

      await next();
    });
  }
}
