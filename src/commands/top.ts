import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import ZetCoins from '../dbModels/ZetCoins';
import ZetCoinsSettings from '../dbModels/ZetCoinsSettings';

export default class TopCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'top',
      description: 'Shows top-10 of richest members in the server',
      group: 'economy',
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const settings = await ZetCoinsSettings.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((i) => i[0]);

    const balances = await ZetCoins.findAll({
      where: { guildID: ctx.guild?.id },
    })
      .then((bals) => bals.filter((bal) => bal.balance > 0))
      .then((bals) => bals.sort((a, b) => b.balance - a.balance));

    const authorBal = await ZetCoins.findOrCreate({
      where: { guildID: ctx.guild?.id, userID: ctx.user?.id },
    }).then((b) => b[0]);
    const authorPos = balances.findIndex((bal) => bal.userID == ctx.user?.id) + 1;

    const description = balances
      .splice(0, 10)
      .map((bal, index) => `${++index}. <@${bal.userID}> - ${bal.balance} ${settings.icon}`);

    const embed = new Embed()
      .setTitle(ctx.t('topTitle', ctx.guild?.name))
      .setDescription(description.length ? description.join('\n') : ctx.t('topEmpty'))
      .setFooter({
        text: authorPos ? ctx.t('topFooter', authorPos, authorBal.balance) : ctx.t('topFooterNonTop'),
        icon_url: ctx.user?.avatarURL,
      })
      .setColor(ctx.get('embColor'));

    await ctx.reply({ embeds: [embed] });
  }
}
