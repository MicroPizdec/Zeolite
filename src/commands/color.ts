import ZeoliteCommand from '../core/ZeoliteCommand';
import ZeoliteContext from '../core/ZeoliteContext';
import convert from 'color-convert';
import Utils from '../utils/Utils';
import Embed from '../core/Embed';
import ZeoliteClient from '../core/ZeoliteClient';

export default class ColorCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'color',
      description: 'Shows info about provided color and converts it to another formats',
      group: 'general',
      options: [
        {
          type: 3,
          name: 'color',
          description: 'A color string in hex or integer',
          required: true,
        },
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    const color = ctx.options.getString('color')!;

    const colorNum = color.startsWith('#') ? parseInt(color.slice(1), 16) : parseInt(color);

    if (isNaN(colorNum)) {
      await ctx.reply({ content: ctx.t('embedcolorIsNaN'), flags: 64 });
      return;
    }

    if (colorNum > 0xffffff) {
      await ctx.reply({ content: ctx.t('embedcolorTooBig'), flags: 64 });
      return;
    }

    const rgb = convert.hex.rgb(Utils.intToHex(colorNum));
    const hsl = convert.rgb.hsl(rgb);
    const cmyk = convert.rgb.cmyk(rgb);

    const embed = new Embed()
      .setTitle(`#${Utils.intToHex(colorNum)}`)
      .setColor(colorNum)
      .addField('RGB', rgb.join())
      .addField('HSL', hsl.map((c) => (c == hsl[0] ? c : `${c}%`)).join(), true)
      .addField('CMYK', cmyk.map((c) => `${c}%`).join(), true)
      .addField(ctx.t('colorNumber'), colorNum.toString())
      .setFooter({
        text: 'Zeolite © Fishyrene',
        icon_url: this.client.user?.avatarURL,
      });

    await ctx.reply({ embeds: [embed] });
  }
}
