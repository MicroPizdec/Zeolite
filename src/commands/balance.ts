import { MessageEmbed, User, GuildMember } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoins from "../dbModels/ZetCoins";
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";

export default class BalanceCommand extends ZeoliteCommand {
  name = "balance";
  description = "Shows the provided user's balance. Defaults to you if no user provided";
  options = [
    {
      type: 6,
      name: "user",
      description: "A user",
      required: false,
    },
  ];
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const user = ctx.interaction.options.getUser("user", false) || ctx.user;

    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(s => s[0]);
    const userBalance = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: user.id } })
      .then(b => b[0]);
    
    const embed = new MessageEmbed()
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 2048 }) })
      .setDescription(`${userBalance.balance} ${settings?.icon}`)
      .setColor(ctx.get("embColor"))
      .addField(ctx.t("balanceDeposit"), `${userBalance.depositBal} ${settings.icon}`)
      .setFooter({ text: "Zeolite © Fishyrene", iconURL: this.client.user?.displayAvatarURL() });

    await ctx.reply({ embeds: [ embed ] })
  }
}
