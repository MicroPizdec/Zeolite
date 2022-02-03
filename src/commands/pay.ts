import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoins from "../dbModels/ZetCoins";
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";

export default class PayCommand extends ZeoliteCommand {
  name = "pay";
  description = "Sends the provided amount of ZetCoins to specified user";
  group = "economy";
  options = [
    {
      type: 6,
      name: "user",
      description: "A user",
      required: true,
    },
    {
      type: 4,
      name: "amount",
      description: "Amount of ZetCoins to send",
      required: true,
    },
  ];
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const user = ctx.options.getUser("user", true);
    const amount = ctx.options.getInteger("amount", true);

    if (user.id == ctx.user.id) {
      await ctx.reply({ content: ctx.t("payCantSendToYourself"), ephemeral: true });
      return;
    }

    if (user.bot) {
      await ctx.reply({ content: ctx.t("payCantSendToBot"), ephemeral: true });
      return;
    }

    if (amount <= 0) {
      await ctx.reply({ content: ctx.t("payInvalidAmount"), ephemeral: true });
      return;
    }
    
    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(s => s[0]);
    const authorBal = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: ctx.user.id } })
      .then(b => b[0]);
    const userBal = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: user.id } })
      .then(b => b[0]);

    if (authorBal.balance < amount) {
      await ctx.reply({ content: ctx.t("payInsufficientFunds", authorBal.balance, settings?.icon), ephemeral: true });
    }
    
    const confirmEmbed = new MessageEmbed()
      .setTitle(ctx.t("payConfirmationTitle", amount, settings?.icon, user.tag))
      .setDescription(ctx.t("payConfirmationDesc"))
      .setColor(ctx.get("embColor"))

    const actionRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel(ctx.t("payYes"))
          .setStyle("SUCCESS")
          .setCustomId("yes")
          .setEmoji("<:success:933053645078007839>"),
        new MessageButton()
          .setLabel(ctx.t("payNo"))
          .setStyle("DANGER")
          .setCustomId("no")
          .setEmoji("<:fail:933053644948004954>")
      );
    
    const message = await ctx.reply({ embeds: [ confirmEmbed ], components: [ actionRow ], fetchReply: true });

    const component = await message?.awaitMessageComponent({
      componentType: "BUTTON",
      filter: i => i.user.id == ctx.user.id,
      time: 300000,
    });

    if (!component) {
      const timeExpiredEmbed = new MessageEmbed()
        .setTitle(ctx.t("payTimeExpired"))
        .setColor(ctx.get("embColor"));
      
      await ctx.editReply({ embeds: [ timeExpiredEmbed ] });
    }

    const button = component?.component as MessageButton;

    if (button.customId == "yes") {
      await userBal.update({ balance: userBal.balance + amount });
      await authorBal.update({ balance: authorBal.balance - amount }); 
      const successEmbed = new MessageEmbed()
        .setTitle(ctx.t("paySuccessfullySent", amount, settings?.icon, user.tag))
        .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
        .setColor("GREEN");

      await component?.update({ embeds: [ successEmbed ], components: [] });
    } else {
      const failEmbed = new MessageEmbed() 
        .setTitle(ctx.t("payCancelled"))
        .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
        .setColor("RED"); 

      await component?.update({ embeds: [ failEmbed ], components: [] });
    } 
  }
}