import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoins from "../dbModels/ZetCoins"; 
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";

export default class DiceCommand extends ZeoliteCommand {
  name = "dice";
  description = "Win or lose the amount of money";
  options = [
    {
      type: 4,
      name: "amount",
      description: "Money amount (obvious, isn't it?)",
      required: true,
    },
  ];
  guildOnly = true;
  cooldown = 5;
  
  async run(ctx: ZeoliteContext) {
    const amount = ctx.options.getInteger("amount", true);

    if (amount <= 0) {
      await ctx.reply({ content: ctx.t("payInvalidAmount"), ephemeral: true });
      return;
    }

    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(s => s[0]);
    const userBal = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: ctx.user.id } })
      .then(b => b[0]);
      
    if (!settings.diceEnabled) {
      await ctx.reply({ content: ctx.t("diceDisabled"), ephemeral: true })
      return;
    }

    if (amount > userBal.balance) {
      await ctx.reply({ content: ctx.t("payInsufficientFunds", userBal.balance, settings.icon), ephemeral: true });
      return;
    }
    
    const chance = Math.random() > 0.5;

    const winEmbed = new MessageEmbed()
      .setTitle(ctx.t("diceWin"))
      .setDescription(ctx.t("diceWinDesc", amount, settings.icon, userBal.balance + amount, settings.icon))
      .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
      .setColor("GREEN");
    
    const lossEmbed = new MessageEmbed()
      .setTitle(ctx.t("diceLoss"))
      .setDescription(ctx.t("diceLossDesc", amount, settings.icon, userBal.balance - amount, settings.icon))
      .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
      .setColor("RED"); 
    
    if (chance) {
      await userBal.update({ balance: userBal.balance + amount });
      await ctx.reply({ embeds: [ winEmbed ]});
    } else {
      await userBal.update({ balance: userBal.balance - amount });
      await ctx.reply({ embeds: [ lossEmbed ]});
    }
  }
}