import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import convert from "color-convert";
import Utils from "../utils/Utils";
import { MessageEmbed } from "discord.js-light";

export default class ColorCommand extends ZeoliteCommand {
  name = "color";
  description = "Shows info about provided color and converts it to another formats";
  group = "general";
  options = [
    {
      type: 3,
      name: "color",
      description: "A color string in hex or integer",
      required: true,
    },
  ];

  async run(ctx: ZeoliteContext) {
    const color = ctx.options.getString("color", true);

    const colorNum = color.startsWith("#") ?
      parseInt(color.slice(1), 16) :
      parseInt(color);
    
    if (isNaN(colorNum)) {
      await ctx.reply({ content: ctx.t("embedcolorIsNaN"), ephemeral: true });
      return;
    }

    if (colorNum > 0xffffff) {
      await ctx.reply({ content: ctx.t("embedcolorTooBig"), ephemeral: true });
      return;
    }

    const rgb = convert.hex.rgb(Utils.intToHex(colorNum));
    const hsl = convert.rgb.hsl(rgb);
    const cmyk = convert.rgb.cmyk(rgb);

    const embed = new MessageEmbed()
      .setTitle(`#${Utils.intToHex(colorNum)}`)
      .setColor(colorNum)
      .addField("RGB", rgb.join())
      .addField("HSL", hsl.map(c => c == hsl[0] ? c : `${c}%`).join(), true)
      .addField("CMYK", cmyk.map(c => `${c}%`).join(), true)
      .addField(ctx.t("colorNumber"), colorNum.toString())
      .setFooter({ text: "Zeolite © Fishyrene", iconURL: this.client.user?.displayAvatarURL() });
    
    await ctx.reply({ embeds: [ embed ] });
  }
}