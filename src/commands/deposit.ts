import ZeoliteCommand from '../core/ZeoliteCommand';
import ZeoliteContext from '../core/ZeoliteContext';
import ZetCoinsSettings from '../dbModels/ZetCoinsSettings';
import ZetCoins from '../dbModels/ZetCoins';
import ZeoliteClient from '../core/ZeoliteClient';
import Embed from '../core/Embed';

export default class DepositCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'deposit',
      description: 'Deposit command',
      group: 'economy',
      options: [
        {
          type: 1,
          name: 'info',
          description: 'Information about deposit',
        },
        {
          type: 1,
          name: 'put',
          description: 'Put money to deposit',
          options: [
            {
              type: 4,
              name: 'amount',
              description: 'Amount of money',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'withdraw',
          description: 'Withdraw money from deposit',
          options: [
            {
              type: 4,
              name: 'amount',
              description: 'Amount of money',
              required: true,
            },
          ],
        },
      ],
      guildOnly: true,
    });
  }

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    const settings = await ZetCoinsSettings.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((s) => s[0]);
    const userBal = await ZetCoins.findOrCreate({
      where: { guildID: ctx.guild?.id, userID: ctx.user?.id },
    }).then((b) => b[0]);

    switch (subcommand) {
      case 'info': {
        const embed = new Embed()
          .setTitle(ctx.t('depositInfo'))
          .setDescription(ctx.t('depositInfoDesc', settings.icon))
          .setColor(ctx.get('embColor'))
          .setFooter({
            text: 'Zeolite © Fishyrene',
            icon_url: this.client.user.avatarURL,
          });

        await ctx.reply({ embeds: [embed] });
        break;
      }

      case 'put': {
        const amount = ctx.options.getInteger('amount')!;

        if (amount > userBal.balance) {
          await ctx.reply({
            content: ctx.t('payInsufficientFunds', userBal.balance, settings.icon),
            flags: 64,
          });
          return;
        }

        await userBal.update({
          balance: userBal.balance - amount,
          depositBal: userBal.depositBal + amount,
        });

        const embed = new Embed()
          .setAuthor({
            name: `${ctx.user?.username}#${ctx.user?.discriminator}`,
            icon_url: ctx.user?.avatarURL,
          })
          .setDescription(
            ctx.t(
              'depositPutDesc',
              amount,
              settings.icon,
              userBal.balance,
              settings.icon,
              userBal.depositBal,
              settings.icon,
            ),
          )
          .setColor(ctx.get('embColor'));

        await ctx.reply({ embeds: [embed], flags: 64 });
        break;
      }

      case 'withdraw': {
        const amount = ctx.options.getInteger('amount')!;

        if (amount > userBal.depositBal) {
          await ctx.reply({
            content: ctx.t('depositInsufficientFunds', userBal.depositBal, settings.icon),
            flags: 64,
          });
          return;
        }

        await userBal.update({
          balance: userBal.balance + amount,
          depositBal: userBal.depositBal - amount,
        });

        const embed = new Embed()
          .setAuthor({
            name: `${ctx.user?.username}#${ctx.user?.discriminator}`,
            icon_url: ctx.user?.avatarURL,
          })
          .setDescription(
            ctx.t(
              'depositWithdrawDesc',
              amount,
              settings.icon,
              userBal.balance,
              settings.icon,
              userBal.depositBal,
              settings.icon,
            ),
          )
          .setColor(ctx.get('embColor'));

        await ctx.reply({ embeds: [embed] });
        break;
      }
    }
  }
}
