// Мы <3 хардкодить
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from "zeolitecore";
import ZetCoinsSettings from '../dbModels/ZetCoinsSettings';

export default class WorkAmountCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'workamount',
      description: 'workamount command',
      group: 'economy',
      options: [
        {
          type: 1,
          name: 'set',
          description: 'Sets the amount of money that can be earned using the /work command. Administrator only',
          options: [
            {
              type: 4,
              name: 'min',
              description: 'Minimum amount of money',
              required: true,
            },
            {
              type: 4,
              name: 'max',
              description: 'Maximum amount of money',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'reset',
          description: 'Resets the amount of money that can be earned. Administrator only',
        },
      ],
      requiredPermissions: ['administrator'],
    });
  }

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    const settings = await ZetCoinsSettings.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((s) => s[0]);

    switch (subcommand) {
      case 'set': {
        const minValue = ctx.options.getInteger('min')!;
        const maxValue = ctx.options.getInteger('max')!;

        await settings.update({
          workMinAmount: minValue,
          workMaxAmount: maxValue,
        });

        await ctx.reply({
          content: ctx.t('workAmountSetSuccess', minValue, maxValue),
          flags: 64,
        });
        break;
      }

      case 'reset': {
        await settings.update({ workMinAmount: 50, workMaxAmount: 300 });

        await ctx.reply({
          content: ctx.t('workAmountResetSuccess'),
          flags: 64,
        });
        break;
      }
    }
  }
}
