import { GuildMember, MessageEmbed, TextBasedChannel } from "discord.js";
import ZeoliteExtension from "../core/ZeoliteExtension";
import Modlogs from "../dbModels/Modlogs";

export default class ModlogsExtension extends ZeoliteExtension {
  private async getModlogsChannel(guildID: string): Promise<string | undefined> {
    return Modlogs.findOne({ where: { guildID } })
      .then(m => m?.channelID);
  }

  async onGuildMemberAdd(member: GuildMember) {
    const channel = await this.getModlogsChannel(member.guild.id);
    if (!channel) return;

    const createdDays = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 86400));

    const embed = new MessageEmbed()
      .setAuthor({ name: `${member.user.tag} joined the server`, iconURL: member.user.displayAvatarURL() })
      .setColor("GREEN")
      .addField("Registered at", `<t:${Math.floor((member.user.createdTimestamp as number) / 1000)}> (${createdDays} days ago)`)
      .setFooter({ text: `ID: ${member.user.id}` })
      .setTimestamp(new Date());

    if (member.user.bot) {
      embed.setAuthor({ name: `${member.user.tag} has been added to this server`, iconURL: member.user.displayAvatarURL() });
      if (member.guild.me?.permissions.has("VIEW_AUDIT_LOG")) {
        const entry = await member.guild.fetchAuditLogs({ type: "BOT_ADD" })
          .then(a => a.entries.first());

        embed.addField("Added by", `${entry?.executor?.tag} (${entry?.executor})`);
      }
    }

    await (this.client.channels.cache.get(channel) as TextBasedChannel).send({ embeds: [ embed ] })
      .catch(() => {});
  }
}