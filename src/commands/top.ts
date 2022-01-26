import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoins from "../dbModels/ZetCoins";
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";

export default class TopCommand extends ZeoliteCommand {
  name = "top";
  description = "Shows top-10 of richest members in the server";
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(i => i[0]);
    
    const balances = await ZetCoins.findAll({ where: { guildID: ctx.guild?.id } })
      .then(bals => bals.filter(bal => bal.balance > 0))
      .then(bals => bals.sort((a, b) => b.balance - a.balance));

    const authorBal = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: ctx.user.id } })
      .then(b => b[0]);
    const authorPos = balances.findIndex(bal => bal.userID == ctx.user.id) + 1;

    const description = balances.splice(0, 10)
      .map((bal, index) => `${++index}. <@${bal.userID}> - ${bal.balance} ${settings.icon}`);
    
    const embed = new MessageEmbed()
      .setTitle(ctx.t("topTitle", ctx.guild?.name))
      .setDescription(description.length ? description.join("\n") : ctx.t("topEmpty"))
      .setFooter({ text: ctx.t("topFooter", authorPos, authorBal.balance), iconURL: ctx.user.displayAvatarURL() })
      .setColor(ctx.get("embColor"));
    
    await ctx.reply({ embeds: [ embed ] });
  }
}