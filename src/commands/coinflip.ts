import { Embed, ZeoliteClient, ZeoliteCommand, ZeoliteContext } from 'zeolitecore';

export default class CoinflipCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'coinflip',
      description: 'Flip the coin',
      group: 'fun',
      descriptionLocalizations: {
        ru: 'Подбросить монетку',
      },
    });
  }

  public async run(ctx: ZeoliteContext) {
    const sidewaysChance = Math.random() < 0.05;
    const chance = Math.random() > 0.5;

    const embed = new Embed()
      .setTitle(ctx.t('coinflipTitle'))
      .setDescription(ctx.t(sidewaysChance ? 'coinflipSideways' : chance ? 'coinflipHeads' : 'coinflipTails'))
      .setColor(ctx.get('embColor'))
      .setFooter({
        text: 'Zeolite © Fishyrene',
        iconURL: this.client.user.avatarURL(),
      });

    await ctx.reply({ embeds: [embed] });
  }
}
