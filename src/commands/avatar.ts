import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class AvatarCommand extends ZeoliteCommand {
  name = "avatar";
  description = "Shows user's avatar";
  options = [
    {
      type: 6,
      name: "user",
      description: "A user",
      required: false,
    },
  ];

  async run(ctx: ZeoliteContext) {
    let user = ctx.interaction.options.getUser("user") || ctx.user;

    const embed = new MessageEmbed()
      .setTitle(ctx.t("avatarTitle", user.tag))
      .setColor(0x9f00ff)
      .setImage(user.displayAvatarURL({ size: 2048 }));
    
    await ctx.reply({ embeds: [ embed ] });
  }
}