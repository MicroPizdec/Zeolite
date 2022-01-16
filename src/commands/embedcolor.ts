import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import EmbedColors from "../dbModels/EmbedColors";
import intToHex from "../utils/intToHex";

export default class EmbedcolorCommand extends ZeoliteCommand {
  name = "embedcolor";
  description = "Changes your embed color or restores it to default";
  options = [
    {
      type: 1,
      name: "get",
      description: "Shows your current embed color",
    },
    {
      type: 1,
      name: "set",
      description: "Sets your embed color",
      options: [
        {
          type: 3,
          name: "color",
          description: "Color value in hex or integer",
          required: false,
        },
        {
          type: 5,
          name: "random",
          description: "Should the embed color be random",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "reset",
      description: "Resets the embed color to default",
    },
  ];

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.interaction.options.getSubcommand();

    const color = await EmbedColors.findOrCreate({ where: { userID: ctx.user.id } })
      .then(c => c[0]);

    switch (subcommand) {
      case "get": {
        const embed = new MessageEmbed()
          .setTitle(ctx.t("embedcolorYourColor"))
          .setDescription(`\`${color.random ? ctx.t("embedcolorRandom") : color.color ? `#${intToHex(color.color)}` : ctx.t("embedcolorDefault")}\``)
          .setColor(await ctx.embColor());
        
        await ctx.reply({ embeds: [ embed ], ephemeral: true });
        break;
      }

      case "set": {
        const newColor = ctx.interaction.options.getString("color");
        const isRandom = ctx.interaction.options.getBoolean("random");

        if (!newColor && isRandom === null) {
          await ctx.reply({ content: ctx.t("embedcolorNoOptions"), ephemeral: true });
          return;
        }

        if (newColor && isRandom) {
          await ctx.reply({ content: ctx.t("embedcolorOnlyOneOption"), ephemeral: true });
          return;
        }

        if (newColor) {
          const colorNum = newColor.startsWith("#") ?
            parseInt(newColor.replace("#", ""), 16) :
            parseInt(newColor);
          
          if (isNaN(colorNum)) {
            await ctx.reply({ content: ctx.t("embedcolorIsNaN"), ephemeral: true });
            return;
          }

          if (colorNum > 16777216) {
            await ctx.reply({ content: ctx.t("embedcolorTooBig"), ephemeral: true });
            return;
          }

          await color.update({ color: colorNum, random: false });
          await ctx.reply({ content: ctx.t("embedcolorSuccess", intToHex(colorNum)), ephemeral: true });
        }

        if (isRandom) {
          await color.update({ color: null, random: true });
          await ctx.reply({ content: ctx.t("embedcolorRandomSuccess"), ephemeral: true });
        }

        break;
      }
      
      case "reset": {
        await color.destroy();
        await ctx.reply({ content: ctx.t("embedcolorResetSuccess"), ephemeral: true });
        break;
      }
    }
  }
}