// Мы <3 хардкодить
import { ApplicationCommandOptionData, MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoins from "../dbModels/ZetCoins"; 
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";

export default class WorkAmountCommand extends ZeoliteCommand {
  name = "workamount";
  description = "workamount command";
  options = [
    {
      type: 1,
      name: "set",
      description: "Sets the amount of money that can be earned using the /work command. Administrator only",
      options: [
        {
          type: 4,
          name: "min",
          description: "Minimum amount of money",
          required: true,
          minValue: 0,
          maxValue: 150,
        },
        {
          type: 4,
          name: "max",
          description: "Maximum amount of money",
          required: true,
          minValue: 200,
          maxValue: 1000,
        },
      ],
    },
    {
      type: 1,
      name: "reset",
      description: "Resets the amount of money that can be earned. Administrator only"
    },
  ];
  requiredPermissions: [ "ADMINISTRATOR" ];

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();
    
    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
    .then(s => s[0]);

    switch (subcommand) {
      case "set": {
        const minValue = ctx.options.getInteger("min", true);
        const maxValue = ctx.options.getInteger("max", true);

        await settings.update({ workMinAmount: minValue, workMaxAmount: maxValue });

        await ctx.reply({ content: ctx.t("workAmountSetSuccess", minValue, maxValue), ephemeral: true });
        break;
      }
      
      case "reset": {
        await settings.update({ workMinAmount: 50, workMaxAmount: 300 });
        
        await ctx.reply({ content: ctx.t("workAmountResetSuccess"), ephemeral: true });
        break;
      }
    }
  }
}