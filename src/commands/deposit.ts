import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";
import ZetCoins from "../dbModels/ZetCoins";
import { MessageEmbed } from "discord.js";

export default class DepositCommand extends ZeoliteCommand {
  name = "deposit";
  description = "Deposit command";
  options = [
    {
      type: 1,
      name: "info",
      description: "Information about deposit",
    },
    {
      type: 1,
      name: "put",
      description: "Put money to deposit",
      options: [
        {
          type: 4,
          name: "amount",
          description: "Amount of money",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "withdraw",
      description: "Withdraw money from deposit",
      options: [
        {
          type: 4,
          name: "amount",
          description: "Amount of money",
          required: true,
        },
      ],
    },
  ];
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(s => s[0]);
    const userBal = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: ctx.user.id } })
      .then(b => b[0]);

    switch (subcommand) {
      case "info": {
        const embed = new MessageEmbed()
          .setTitle(ctx.t("depositInfo"))
          .setDescription(ctx.t("depositInfoDesc"))
          .setColor(await ctx.embColor())
          .setFooter({ text: "Zeolite © Fishyrene", iconURL: this.client.user?.displayAvatarURL() });

        await ctx.reply({ embeds: [ embed ] });
        break;
      }

      case "put": {
        const amount = ctx.options.getInteger("amount", true);

        if (amount > userBal.balance) {
          await ctx.reply({
            content: ctx.t("payInsufficientFunds", userBal.balance, settings.icon),
            ephemeral: true,
          });
          return;
        }

        await userBal.update({
          balance: userBal.balance - amount,
          depositBal: userBal.depositBal + amount,
        });

        const embed = new MessageEmbed()
          .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
          .setDescription(ctx.t(
            "depositPutDesc", amount, settings.icon,
            userBal.balance, settings.icon, 
            userBal.depositBal, settings.icon
          ))
          .setColor(await ctx.embColor());

        await ctx.reply({ embeds: [ embed ], ephemeral: true });
        break;
      }

      case "withdraw": {
        const amount = ctx.options.getInteger("amount", true);

        if (amount > userBal.depositBal) {
          await ctx.reply({
            content: ctx.t("depositInsufficientFunds", userBal.depositBal, settings.icon),
            ephemeral: true,
          });
          return;
        }

        await userBal.update({
          balance: userBal.balance + amount,
          depositBal: userBal.depositBal - amount,
        });

        const embed = new MessageEmbed()
          .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
          .setDescription(ctx.t(
            "depositWithdrawDesc", amount, settings.icon,
            userBal.balance, settings.icon, 
            userBal.depositBal, settings.icon
          ))
          .setColor(await ctx.embColor());

        await ctx.reply({ embeds: [ embed ] });
        break;
      }
    }
  }
}