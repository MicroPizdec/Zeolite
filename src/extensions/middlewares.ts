import { ZeoliteExtension } from "zeolitecore";
import EmbedColors from "../dbModels/EmbedColors";
import Languages from "../dbModels/Languages";

export default class MiddlewaresExtension extends ZeoliteExtension {
  name = 'middlewares';
  private userLocalesCache: Record<string, string> = {};
  private colorsCache: Record<string, string> = {};

  public async onLoad(): Promise<void> {
    this.client.addMiddleware(async (ctx, next) => {
      if (
        !this.client.localizationManager.userLanguages[ctx.user.id] ||
        this.userLocalesCache[ctx.user.id] != ctx.interaction.locale
      ) {
        this.userLocalesCache[ctx.user.id] = ctx.interaction.locale;

        const lang = await Languages.findOrCreate({ where: { userID: ctx.user.id } })
          .then((l) => l[0]);
        if (lang.getDataValue('changed')) {
          this.client.localizationManager.userLanguages[ctx.user.id] = lang.getDataValue('language');
        } else {
          this.client.localizationManager.userLanguages[ctx.user.id] = ctx.interaction.locale;
        }
      }

      await next();
    });

    this.client.addMiddleware(async (ctx, next) => {
      const color = await EmbedColors.findOne({ where: { userID: ctx.user.id } });

      ctx.set(
        'embColor',
        color
          ? color.random
            ? Math.round(Math.random() * 16777216)
            : color.color || config.defaultColor || 0x9f00ff
          : config.defaultColor || 0x9f00ff,
      );

      await next();
    });
  }
}