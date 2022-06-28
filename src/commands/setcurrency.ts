import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from "zeolitecore";
import ZetCoinsSettings from '../dbModels/ZetCoinsSettings';
import emojiRegex from 'emoji-regex';

export default class SetCurrencyCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'setcurrency',
      description: 'Sets the currency icon. Can only be used by administrators',
      group: 'economy',
      options: [
        {
          type: 1,
          name: 'icon',
          description: 'Sets the new currency icon (obvious)',
          options: [
            {
              type: 3,
              name: 'icon',
              description: 'New currency icon.',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'reset',
          description: 'Resets the currency icon',
        },
      ],
      requiredPermissions: ['administrator'],
    });
  }

  public async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    const settings = await ZetCoinsSettings.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((s) => s[0]);

    switch (subcommand) {
      case 'icon': {
        const icon = ctx.options.getString('icon')!;

        if (!/<a:.+?:\d+>|<:.+?:\d+>/g.test(icon) && !emojiRegex().test(icon)) {
          await ctx.reply({ content: ctx.t('invalidEmoji'), flags: 64 });
          return;
        }

        await settings.update({ icon });

        await ctx.reply(ctx.t('setcurrencySuccess', icon));
        break;
      }
      case 'reset': {
        await settings.update({ icon: '<:zetcoins:929419222436708373>' });
        await ctx.reply({
          content: ctx.t('setcurrencyResetSuccess'),
          flags: 64,
        });
        break;
      }
    }
  }
}
