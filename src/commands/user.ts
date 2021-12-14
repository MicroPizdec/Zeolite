import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class UserCommand extends ZeoliteCommand {
  name = "user";
  description = "Information about provided user. Defaults to you.";
  options = [
    {
      type: 6,
      name: "user",
      description: "A user",
      required: false,
    },
  ];

  async run(ctx: ZeoliteContext) {
    const user = ctx.interaction.options.getUser("user") || ctx.user;
    const member = ctx.guild?.members.cache.has(user.id) ?
      ctx.guild.members.cache.get(user.id) :
      await ctx.guild?.members.fetch(user);

    const embed = new MessageEmbed()
      .setAuthor(user.tag)
      .setThumbnail(user.displayAvatarURL())
      .setColor(member?.displayColor || 0x9f00ff)
      .setFooter(`ID: ${user.id}`);
    
    await ctx.reply({ embeds: [ embed ] });
  }
}