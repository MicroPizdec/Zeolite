import {
  GuildAuditLogsEntry,
  GuildBan,
  GuildMember,
  Message,
  MessageEmbed,
  TextBasedChannel,
  Invite,
  Guild,
  PartialGuildMember,
  PartialMessage
} from "discord.js-light";
import ZeoliteExtension from "../core/ZeoliteExtension";
import Modlogs from "../dbModels/Modlogs";

let self: ModlogsExtension;

export default class ModlogsExtension extends ZeoliteExtension {
  name = "modlogs";
  
  public channelsCache: Record<string, string | undefined> = {};

  private async getModlogsChannel(guildID: string): Promise<string | undefined> {
    let channel: string | undefined;

    if (this.channelsCache[guildID]) {
      channel = this.channelsCache[guildID];
    } else {
      const ch = await Modlogs.findOne({ where: { guildID } })
        .then(m => m?.channelID);

      if (ch) channel = this.channelsCache[guildID] = ch;
    }

    return channel;
  }

  async onGuildMemberAdd(member: GuildMember) {
    const channel = await self.getModlogsChannel(member.guild.id);
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

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  async onGuildMemberRemove(member: GuildMember | PartialGuildMember) {
    const channel = await self.getModlogsChannel(member.guild.id);
    if (!channel) return;

    let entry: GuildAuditLogsEntry<"MEMBER_KICK" | "MEMBER_BAN_ADD", "MEMBER_KICK" | "MEMBER_BAN_ADD", "DELETE", "USER"> | undefined;
    if (member.guild.me?.permissions.has("VIEW_AUDIT_LOG")) {
      entry = await member.guild.fetchAuditLogs<"MEMBER_KICK" | "MEMBER_BAN_ADD">().then(a => a.entries.first());
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: `${member.user.tag} left the server`, iconURL: member.user.displayAvatarURL() })
      .setColor("RED")
      .setFooter({ text: `ID: ${member.user.id}` })
      .setTimestamp(new Date());

    if (entry) {
      if (entry.action == "MEMBER_KICK") {
        embed.setAuthor({ name: `${member.user.tag} was kicked`, iconURL: member.user.displayAvatarURL() })
          .setDescription(`Reason: ${entry.reason || "None"}`)
          .addField("Kicked by", entry.executor?.tag!);
      } else if (entry.action == "MEMBER_BAN_ADD") {
        embed.setAuthor({ name: `${member.user.tag} was banned`, iconURL: member.user.displayAvatarURL() })
          .setDescription(`Reason: ${entry.reason || "None"}`)
          .addField("Banned by", entry.executor?.tag!);
      }
    }

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  async onGuildBanRemove(ban: GuildBan) {
    const channel = await self.getModlogsChannel(ban.guild.id);
    if (!channel) return;

    let entry: GuildAuditLogsEntry<"MEMBER_BAN_REMOVE", "MEMBER_BAN_REMOVE", "CREATE", "USER"> | undefined;
    if (ban.guild.me?.permissions.has("VIEW_AUDIT_LOG")) {
      entry = await ban.guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then(a => a.entries.first());
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: `${ban.user.tag} was unbanned`, iconURL: ban.user.displayAvatarURL() })
      .setColor("GOLD")
      .setFooter({ text: `ID: ${ban.user.id} `})
      .setTimestamp(new Date());

    if (entry) {
      embed.addField("Unbanned by", entry.executor?.tag!);
    }

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  async onMessageDelete(msg: Message | PartialMessage) {
    if (!msg.guild) return;
    const channel = await self.getModlogsChannel(msg.guild.id);
    if (!channel) return;

    if (!msg.author) return;
    if (msg.author.bot) return;
    if (!msg.content) return;

    const embed = new MessageEmbed()
      .setTitle("Message deleted")
      .setDescription(msg.cleanContent || msg.content)
      .setColor("RED")
      .addField("Author", `${msg.author.tag} (${msg.author})`)
      .addField("Channel", `${msg.channel}`)
      .setFooter({ text: `Message ID: ${msg.id}` })
      .setTimestamp(new Date());

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  async onMessageUpdate(oldMsg: Message | PartialMessage, newMsg: Message | PartialMessage) {
    if (!oldMsg.guild) return;
    const channel = await self.getModlogsChannel(oldMsg.guild.id);
    if (!channel) return;

    if (!oldMsg.author) return;
    if (oldMsg.author.bot) return;
    if (!oldMsg.content || oldMsg.content == newMsg.content) return;

    const embed = new MessageEmbed()
      .setTitle("Message edited")
      .setDescription(`[(jump)](${newMsg.url})`)
      .setColor("GOLD")
      .addField("Old content", oldMsg.content)
      .addField("New content", newMsg.content!)
      .addField("Author", `${newMsg.author?.tag} (${newMsg.author})`)
      .addField("Channel", `${newMsg.channel}`)
      .setFooter({ text: `Message ID: ${newMsg.id}` })
      .setTimestamp(new Date());

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  async onGuildMemberUpdate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    const channel = await self.getModlogsChannel(oldMember.guild.id);
    if (!channel) return;

    const embed = new MessageEmbed();

    if (oldMember.nickname != newMember.nickname) {
      embed.setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL() })
        .setTitle("Nickname changed")
        .setColor("GOLD")
        .addField("Old nickname", oldMember.nickname || newMember.user.username, true)
        .addField("New nickname", newMember.nickname || newMember.user.username, true)
        .setFooter({ text: `Member ID: ${newMember.user.id}` })
        .setTimestamp(new Date());

      if (oldMember.guild.me?.permissions.has("VIEW_AUDIT_LOG")) {
        const entry = await oldMember.guild.fetchAuditLogs({ type: "MEMBER_UPDATE" })
          .then(a => a.entries.first());

        if (entry?.target?.id == oldMember.user.id) {
          embed.addField("Changed by", entry.executor?.tag!)
        }
      }
    } else {
      const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
      const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

      const role = [...addedRoles.values()][0] || [...removedRoles.values()][0]; // Collection.first() gives us TypeError, idk why
      if (!role) return;

      embed.setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL() })
        .setTitle("Member roles changed")
        .setColor("GOLD")
        .addField(addedRoles.size ? "Role added" : "Role removed", `${role}`)
        .setFooter({ text: `Member ID: ${newMember.user.id}` })
        .setTimestamp(new Date());
    }

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  async onInviteCreate(invite: Invite) {
    const channel = await self.getModlogsChannel(invite.guild?.id!);
    if (!channel) return;

    const embed = new MessageEmbed()
      .setAuthor({ name: `${invite.inviter?.tag} created an invite ${invite.code}`, iconURL: invite.inviter?.displayAvatarURL() })
      .setDescription(`Channel: ${invite.channel}`)
      .setColor("GREEN")
      .setTimestamp(new Date());

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  async onInviteDelete(invite: Invite) {
    const channel = await self.getModlogsChannel(invite.guild?.id!);
    if (!channel) return;

    if (!(invite.guild as Guild).me?.permissions.has("VIEW_AUDIT_LOG")) return;
    const entry = await (invite.guild as Guild).fetchAuditLogs({ type: "INVITE_DELETE" })
      .then(a => a.entries.first());
    
    const embed = new MessageEmbed()
      .setAuthor({ name: `${entry?.executor?.tag} deleted an invite ${invite.code}`, iconURL: entry?.executor?.displayAvatarURL() })
      .setColor("RED")
      .setTimestamp(new Date());

    await (self.client.channels.cache.get(channel) as TextBasedChannel)?.send({ embeds: [ embed ] })
      .catch(() => {});
  }

  public onLoad() {
    self = this;

    this.client.on("guildMemberAdd", this.onGuildMemberAdd);
    this.client.on("guildMemberRemove", this.onGuildMemberRemove);
    this.client.on("guildBanRemove", this.onGuildBanRemove);
    this.client.on("messageDelete", this.onMessageDelete);
    this.client.on("messageUpdate", this.onMessageUpdate);
    this.client.on("guildMemberUpdate", this.onGuildMemberUpdate);
    this.client.on("inviteCreate", this.onInviteCreate);
    this.client.on("inviteDelete", this.onInviteDelete);
  }

  public onUnload() {
    this.client.off("guildMemberAdd", this.onGuildMemberAdd);
    this.client.off("guildMemberRemove", this.onGuildMemberRemove);
    this.client.off("guildBanRemove", this.onGuildBanRemove);
    this.client.off("messageDelete", this.onMessageDelete);
    this.client.off("messageUpdate", this.onMessageUpdate);
    this.client.off("guildMemberUpdate", this.onGuildMemberUpdate);
    this.client.off("inviteCreate", this.onInviteCreate);
    this.client.off("inviteDelete", this.onInviteDelete);
  }
}