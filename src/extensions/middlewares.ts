import { ZeoliteContext, ZeoliteExtension } from "zeolitecore";
import EmbedColors from "../dbModels/EmbedColors";
import Languages from "../dbModels/Languages";

export default class MiddlewaresExtension extends ZeoliteExtension {
  name = 'middlewares';
  private userLocalesCache: Record<string, string> = {};
  private colorsCache: Record<string, string> = {};

  private async colorsMiddleware(this: MiddlewaresExtension, ctx: ZeoliteContext, next: () => void | Promise<void>) {
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
  }

  public async onLoad(): Promise<void> {
    this.client.addMiddleware(this.colorsMiddleware);
  }

  public onUnload(): void {
    this.client.removeMiddleware(this.colorsMiddleware);
  }
}