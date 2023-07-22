import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import ZetCoins from '../dbModels/ZetCoins';
import ZetCoinsSettings from '../dbModels/ZetCoinsSettings';
import Utils from '../utils/Utils';

export default class WorkCommand extends ZeoliteCommand {
  private cooldowns: Map<string, Map<string, number>>;

  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'work',
      description: 'Earn a random amount of money',
      group: 'economy',
      guildOnly: true,
    });

    this.cooldowns = new Map();
  }

  async run(ctx: ZeoliteContext) {
    if (this.cooldowns.has(ctx.guild?.id!) && this.cooldowns.get(ctx.guild?.id!)?.has(ctx.user!.id)) {
      const cooldown = this.cooldowns.get(ctx.guild?.id!)?.get(ctx.user!.id);
      const minsLeft = Math.floor(cooldown! / 1000);

      const embed = new Embed()
        .setTitle(ctx.t('workCooldownTitle'))
        .setDescription(ctx.t('workCooldown', minsLeft))
        .setAuthor({
          name: Utils.getUserTag(ctx.user),
          iconURL: ctx.user?.avatarURL(),
        })
        .setColor(ctx.get('embColor'));

      await ctx.reply({ embeds: [embed], flags: 64 });
      return;
    }

    const settings = await ZetCoinsSettings.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((s) => s[0]);
    const userBal = await ZetCoins.findOrCreate({
      where: { guildID: ctx.guild?.id, userID: ctx.user?.id },
    }).then((b) => b[0]);

    if (!settings.workEnabled) {
      await ctx.reply({ content: ctx.t('workDisabled'), flags: 64 });
      return;
    }

    const amount = Utils.randInt(settings.workMinAmount, settings.workMaxAmount);

    await userBal.update({ balance: userBal.balance + amount });

    const embed = new Embed()
      .setDescription(ctx.t('workDesc', amount, settings.icon, userBal.balance, settings.icon))
      .setAuthor({
        name: Utils.getUserTag(ctx.user),
        iconURL: ctx.user?.avatarURL(),
      })
      .setColor(ctx.get('embColor'));

    await ctx.reply({ embeds: [embed] });

    if (!this.cooldowns.has(ctx.guild?.id!)) this.cooldowns.set(ctx.guild?.id!, new Map());
    this.cooldowns.get(ctx.guild?.id!)?.set(ctx.user!.id, Date.now() + 3600000);
    setTimeout(() => this.cooldowns.get(ctx.guild?.id!)?.delete(ctx.user!.id), 3600000);
  }
}
