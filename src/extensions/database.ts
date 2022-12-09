import { ZeoliteExtension, ZeoliteContext } from 'zeolitecore';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { getLogger, Logger } from 'log4js';

declare global {
  var a: number;
}

export default class DatabaseExtension extends ZeoliteExtension {
  name = 'database';
  public sequelize: Sequelize;
  private logger: Logger;
  private userLocalesCache: Record<string, string> = {};

  public async onLoad() {
    this.logger = getLogger('Database');

    this.sequelize = new Sequelize(config.dbUri || 'sqlite:bot.db', {
      logging: msg => this.logger.debug(msg),
    });
    this.sequelize.addModels([path.join(__dirname, '..', 'dbModels')]);

    await this.sequelize
      .sync()
      .then(() => this.logger.info('Connected to DB.'))
      .catch((err) => this.logger.error(`Failed to connect to DB:\n${err.stack}`));

    this.client.addMiddleware(async (ctx, next) => {
      if (!this.client.localizationManager.userLanguages[ctx.user.id] || this.userLocalesCache[ctx.user.id] != ctx.interaction.locale) {
        this.userLocalesCache[ctx.user.id] = ctx.interaction.locale;
        const lang = await this.sequelize.models.Languages.findOrCreate({
          where: { userID: ctx.user.id },
        }).then((l) => l[0]);
        if (lang.getDataValue('changed')) {
          this.client.localizationManager.userLanguages[ctx.user.id] = lang.getDataValue('language');
        } else {
          this.client.localizationManager.userLanguages[ctx.user.id] = ctx.interaction.locale;
        }
      }

      await next();
    });

    this.client.addMiddleware(async (ctx, next) => {
      const color = await this.sequelize.models.EmbedColors.findOne({
        where: { userID: ctx.user.id },
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
