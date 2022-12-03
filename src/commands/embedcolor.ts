import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import EmbedColors from '../dbModels/EmbedColors';
import Utils from '../utils/Utils';

export default class EmbedcolorCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'embedcolor',
      description: 'Changes your embed color or restores it to default',
      group: 'settings',
      options: [
        {
          type: 1,
          name: 'get',
          description: 'Shows your current embed color',
        },
        {
          type: 1,
          name: 'set',
          description: 'Sets your embed color',
          options: [
            {
              type: 3,
              name: 'color',
              description: 'Color value in hex or integer',
              required: false,
            },
            {
              type: 5,
              name: 'random',
              description: 'Should the embed color be random',
              required: false,
            },
          ],
        },
        {
          type: 1,
          name: 'reset',
          description: 'Resets the embed color to default',
        },
      ],
    });
  }

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubCommand()!;

    const color = await EmbedColors.findOrCreate({
      where: { userID: ctx.user!.id },
    }).then((c) => c[0]);

    switch (subcommand[0]) {
      case 'get': {
        const embed = new Embed()
          .setTitle(ctx.t('embedcolorYourColor'))
          .setDescription(
            `\`${
              color.random
                ? ctx.t('embedcolorRandom')
                : color.color
                ? `#${Utils.intToHex(color.color)}`
                : ctx.t('embedcolorDefault')
            }\``,
          )
          .setColor(ctx.get('embColor'));

        await ctx.reply({ embeds: [embed], flags: 64 });
        break;
      }

      case 'set': {
        const newColor = ctx.options.getString('color')!;
        const isRandom = ctx.options.getBoolean('random');

        if (!newColor && isRandom === null) {
          await ctx.reply({
            content: ctx.t('embedcolorNoOptions'),
            flags: 64,
          });
          return;
        }

        if (newColor && isRandom) {
          await ctx.reply({
            content: ctx.t('embedcolorOnlyOneOption'),
            flags: 64,
          });
          return;
        }

        if (newColor) {
          const colorNum = newColor.startsWith('#') ? parseInt(newColor.replace('#', ''), 16) : parseInt(newColor);

          if (isNaN(colorNum)) {
            await ctx.reply({
              content: ctx.t('embedcolorIsNaN'),
              flags: 64,
            });
            return;
          }

          if (colorNum > 16777216) {
            await ctx.reply({
              content: ctx.t('embedcolorTooBig'),
              flags: 64,
            });
            return;
          }

          await color.update({ color: colorNum, random: false });
          await ctx.reply({
            content: ctx.t('embedcolorSuccess', Utils.intToHex(colorNum)),
            flags: 64,
          });
        }

        if (isRandom) {
          await color.update({ color: null, random: true });
          await ctx.reply({
            content: ctx.t('embedcolorRandomSuccess'),
            flags: 64,
          });
        }

        break;
      }

      case 'reset': {
        await color.destroy();
        await ctx.reply({
          content: ctx.t('embedcolorResetSuccess'),
          flags: 64,
        });
        break;
      }
    }
  }
}
