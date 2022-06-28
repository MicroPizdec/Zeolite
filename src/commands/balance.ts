import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from "zeolitecore";
import ZetCoins from '../dbModels/ZetCoins';
import ZetCoinsSettings from '../dbModels/ZetCoinsSettings';

export default class BalanceCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'balance',
      description: "Shows the provided user's balance. Defaults to you if no user provided",
      group: 'economy',
      options: [
        {
          type: 6,
          name: 'user',
          description: 'A user',
          required: false,
        },
      ],
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const user = ctx.options.getUser('user')! || ctx.user;

    const settings = await ZetCoinsSettings.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((s) => s[0]);
    const userBalance = await ZetCoins.findOrCreate({
      where: { guildID: ctx.guild?.id, userID: user.id },
    }).then((b) => b[0]);

    const embed = new Embed()
      .setAuthor({
        name: `${user.username}#${user.discriminator}`,
        icon_url: user.avatarURL,
      })
      .setDescription(`${userBalance.balance} ${settings?.icon}`)
      .setColor(ctx.get('embColor'))
      .addField(ctx.t('balanceDeposit'), `${userBalance.depositBal} ${settings.icon}`)
      .setFooter({
        text: 'Zeolite © Fishyrene',
        icon_url: this.client.user.avatarURL,
      });

    await ctx.reply({ embeds: [embed] });
  }
}
