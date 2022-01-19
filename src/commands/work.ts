import { MessageEmbed, User, GuildMember, MessageActionRow, MessageButton, MessageActionRowComponent } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoins from "../dbModels/ZetCoins"; 
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";

export default class WorkCommand extends ZeoliteCommand {
  name = "work";
  description = "Earn a random amount of money";
  guildOnly = true;

  cooldowns: Map<string, number> = new Map<string, number>();
  
  async run(ctx: ZeoliteContext) {
    if (this.cooldowns.has(ctx.user.id)) {
      const cooldown = this.cooldowns?.get(ctx.user.id);
      const minsLeft = Math.floor((cooldown as number) / 1000);

      const embed = new MessageEmbed()
        .setTitle(ctx.t("workCooldownTitle"))
        .setDescription(ctx.t("workCooldown", minsLeft))
        .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
        .setColor(await ctx.embColor());
      
      await ctx.reply({ embeds: [ embed ], ephemeral: true });
      return;
    }

    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(s => s[0]);
    const userBal = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: ctx.user.id } })
      .then(b => b[0]);

    if (!settings.workEnabled) {
      await ctx.reply({ content: ctx.t("workDisabled"), ephemeral: true });
      return;
    }
    
    const amount = this.randInt(settings.workMinAmount, settings.workMaxAmount);

    await userBal.update({ balance: userBal.balance + amount });

    const embed = new MessageEmbed()
      .setDescription(ctx.t("workDesc", amount, settings.icon, userBal.balance, settings.icon))
      .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
      .setColor(await ctx.embColor());

    await ctx.reply({ embeds: [ embed ] });

    this.cooldowns.set(ctx.user.id, Date.now() + 3600000);
    setTimeout(() => this.cooldowns.delete(ctx.user.id), 3600000);
  }

  randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}