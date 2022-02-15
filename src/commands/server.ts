import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class ServerCommand extends ZeoliteCommand {
  name = "server";
  description = "Shows server info";
  group = "general";
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const createdDays = Math.floor((Date.now() - ctx.guild!.createdTimestamp) / (1000 * 86400));
    const owner = await ctx.guild!.fetchOwner();

    const textChannels = ctx.guild!.channels.cache.filter(c => c.isText()).size;
    const voiceChannels = ctx.guild!.channels.cache.filter(c => c.isVoice()).size;

    const staticEmojis = ctx.guild!.emojis.cache.filter(e => !e.animated).size;
    const animatedEmojis = ctx.guild!.emojis.cache.filter(e => e.animated as boolean).size;

    const embed = new MessageEmbed()
      .setAuthor({ name: ctx.guild!.name })
      .setDescription(ctx.guild?.description!)
      .setThumbnail(ctx.guild?.iconURL()!)
      .setColor(ctx.get("embColor"))
      .addField(ctx.t("serverOwner"), owner.user.tag)
      .addField(ctx.t("serverVerificationLevel"), ctx.t(ctx.guild!.verificationLevel))
      .addField(ctx.t("serverChannels"), ctx.t("serverChannelsDesc", textChannels, voiceChannels), true)
      .addField(ctx.t("serverMembers"), ctx.guild!.memberCount.toString(), true)
      .addField(ctx.t("serverEmojis"), ctx.t("serverEmojisDesc", staticEmojis, animatedEmojis), true)
      .addField(ctx.t("serverRolesCount"), ctx.guild!.roles.cache.size.toString())
      .setFooter({ text: ctx.t("serverFooter", ctx.guild!.id, createdDays) })
      .setTimestamp(ctx.guild!.createdAt);
    
    await ctx.reply({ embeds: [ embed ] });
  }
}