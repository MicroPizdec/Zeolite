import {
  Guild,
  Member,
  User,
  PossiblyUncachedMessage,
  TextChannel,
  AuditLogEntry,
  Message,
  Invite,
  Uncached,
  JSONMessage,
  JSONMember,
} from 'oceanic.js';
import { ZeoliteExtension, Embed } from 'zeolitecore';
import Modlogs from '../dbModels/Modlogs';

let self: ModlogsExtension;

export default class ModlogsExtension extends ZeoliteExtension {
  name = 'modlogs';

  public channelsCache: Record<string, string | undefined> = {};

  private async getModlogsChannel(guildID: string): Promise<string | undefined> {
    let channel: string | undefined;

    if (this.channelsCache[guildID]) {
      channel = this.channelsCache[guildID];
    } else {
      const ch = await Modlogs.findOne({ where: { guildID } }).then((m) => m?.channelID);

      if (ch) channel = this.channelsCache[guildID] = ch;
    }

    return channel;
  }

  async onGuildMemberAdd(member: Member) {
    const channel = await self.getModlogsChannel(member.guild.id);
    if (!channel) return;

    const createdDays = Math.floor((Date.now() - member.createdAt.getTime()) / (1000 * 86400));

    const embed = new Embed()
      .setAuthor({
        name: `${member.user.username}#${member.user.discriminator} joined the server`,
        iconURL: member.avatarURL(),
      })
      .setColor(0x57f287)
      .addField('Registered at', `<t:${Math.floor(member.createdAt.getTime() / 1000)}> (${createdDays} days ago)`)
      .setFooter({ text: `ID: ${member.user.id}` })
      .setTimestamp(new Date().toISOString());

    if (member.user.bot) {
      embed.setAuthor({
        name: `${member.user.username}#${member.user.discriminator} has been added to this server`,
        iconURL: member.avatarURL(),
      });
      if (member.guild.members.get(self.client.user.id)?.permissions.has('VIEW_AUDIT_LOG')) {
        const entry = await member.guild.getAuditLog({ actionType: 28 }).then((a) => a.entries[0]);

        embed.addField('Added by', `${entry.user?.tag} (${entry.user?.id})`);
      }
    }

    await this.client.getChannel<TextChannel>(channel)
      ?.createMessage({ embeds: [embed] })
      .catch(() => {});
  }

  async onGuildMemberRemove(member: Member | User, guild: Guild) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    let entry: AuditLogEntry | undefined;
    if (guild.members.get(self.client.user.id)?.permissions.has('VIEW_AUDIT_LOG')) {
      entry = await guild.getAuditLog().then((l) => l.entries.find((e) => e.actionType == 20 || e.actionType == 22));
    }

    const embed = new Embed()
      .setAuthor({
        name: `${member.tag} left the server`,
        iconURL: member.avatarURL(),
      })
      .setColor(0xed4245)
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp(new Date().toISOString());

    if (entry) {
      if (entry.actionType == 20) {
        embed
          .setAuthor({
            name: `${member.tag} was kicked`,
            iconURL: member.avatarURL(),
          })
          .setDescription(`Reason: ${entry.reason || 'None'}`)
          .addField('Kicked by', `${entry.user?.tag}`);
      } else if (entry.actionType == 22) {
        embed
          .setAuthor({
            name: `${member.tag} was banned`,
            iconURL: member.avatarURL(),
          })
          .setDescription(`Reason: ${entry.reason || 'None'}`)
          .addField('Banned by', `${entry.user?.tag}`);
      }
    }

    await this.client.getChannel<TextChannel>(channel)
      ?.createMessage({ embeds: [embed] })
      .catch(() => {});
  }

  async onGuildBanRemove(guild: Guild, user: User) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    let entry: AuditLogEntry | undefined;
    if (guild.members.get(self.client.user.id)?.permissions.has('VIEW_AUDIT_LOG')) {
      entry = await guild.getAuditLog({ actionType: 23 }).then((l) => l.entries[0]);
    }

    const embed = new Embed()
      .setAuthor({
        name: `${user.tag} was unbanned`,
        iconURL: user.avatarURL(),
      })
      .setColor(0xf1c40f)
      .setFooter({ text: `ID: ${user.id} ` })
      .setTimestamp(new Date().toISOString());

    if (entry) {
      embed.addField('Unbanned by', `${entry.user?.tag}`);
    }

    await this.client.getChannel<TextChannel>(channel)
      ?.createMessage({ embeds: [embed] })
      .catch(() => {});
  }

  async onMessageDelete(msg: Message) {
    if (!msg.guildID) return;
    const channel = await self.getModlogsChannel(msg.guildID);
    if (!channel) return;

    if (!msg.author || !msg.content || msg.author.bot) return;

    const embed = new Embed()
      .setTitle('Message deleted')
      .setDescription(msg.content)
      .setColor(0xed4245)
      .addField('Author', `${msg.author.username}#${msg.author.discriminator} (${msg.author.mention})`)
      .addField('Channel', `${msg.channel?.mention}`)
      .setFooter({ text: `Message ID: ${msg.id}` })
      .setTimestamp(new Date().toISOString());

    await this.client.getChannel<TextChannel>(channel)
      ?.createMessage({ embeds: [embed] })
      .catch(() => {});
  }

  async onMessageUpdate(msg: Message, oldMsg: JSONMessage) {
    if (!oldMsg || !msg.guildID) return;
    const channel = await self.getModlogsChannel(msg.guildID);
    if (!channel) return;

    if (!msg.author) return;
    if (msg.author.bot) return;
    if (!oldMsg.content || oldMsg.content == msg.content) return;

    const embed = new Embed()
      .setTitle('Message edited')
      .setDescription(`[(jump)](${msg.jumpLink})`)
      .setColor(0xf1c40f)
      .addField('Old content', oldMsg.content)
      .addField('New content', msg.content!)
      .addField('Author', `${msg.author.username}#${msg.author.discriminator} (${msg.author.mention})`)
      .addField('Channel', `${msg.channel?.mention}`)
      .setFooter({ text: `Message ID: ${msg.id}` })
      .setTimestamp(new Date().toISOString());

    await this.client.getChannel<TextChannel>(channel)
      ?.createMessage({ embeds: [embed] })
      .catch(() => {});
  }

  async onGuildMemberUpdate(member: Member, oldMember: JSONMember) {
    if (!oldMember) return;

    const channel = await self.getModlogsChannel(member.guild.id);
    if (!channel) return;

    const embed = new Embed();

    if (oldMember.nick != member.nick) {
      embed
        .setAuthor({
          name: `${member.username}#${member.discriminator}`,
          iconURL: member.avatarURL(),
        })
        .setTitle('Nickname changed')
        .setColor(0xf1c40f)
        .addField('Old nickname', oldMember.nick || member.username, true)
        .addField('New nickname', member.nick || member.username, true)
        .setFooter({ text: `Member ID: ${member.user.id}` })
        .setTimestamp(new Date().toISOString());

      if (member.guild.members.get(self.client.user.id)?.permissions.has('VIEW_AUDIT_LOG')) {
        const entry = await member.guild.getAuditLog({ actionType: 24 }).then((a) => a.entries[0]);

        if (entry?.targetID == member.id) {
          embed.addField('Changed by', `${entry.user?.tag}`);
        }
      }
    } else {
      const addedRoles = member.roles.filter((r) => !oldMember.roles.includes(r));
      const removedRoles = oldMember.roles.filter((r) => !member.roles.includes(r));

      const role = addedRoles[0] || removedRoles[0];
      if (!role) return;

      embed
        .setAuthor({
          name: `${member.username}#${member.discriminator}`,
          iconURL: member.avatarURL(),
        })
        .setTitle('Member roles changed')
        .setColor(0xf1c40f)
        .addField(addedRoles.length ? 'Role added' : 'Role removed', `<@&${role}>`)
        .setFooter({ text: `Member ID: ${member.user.id}` })
        .setTimestamp(new Date().toISOString());
    }

    await this.client.getChannel<TextChannel>(channel)
      ?.createMessage({ embeds: [embed] })
      .catch(() => {});
  }

  async onInviteCreate(guild: Guild, invite: Invite) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    const embed = new Embed()
      .setAuthor({
        name: `${invite.inviter?.username}#${invite.inviter?.discriminator} created an invite ${invite.code}`,
        iconURL: invite.inviter?.avatarURL(),
      })
      .setDescription(`Channel: #${invite.channel?.name}`)
      .setColor(0x57f287)
      .setTimestamp(new Date().toISOString());

    await this.client.getChannel<TextChannel>(channel)
      ?.createMessage({ embeds: [embed] })
      .catch(() => {});
  }

  async onInviteDelete(guild: Guild, invite: Invite) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    if (guild.members.get(self.client.user.id)?.permissions.has('VIEW_AUDIT_LOG')) return;
    const entry = await guild.getAuditLog({ actionType: 42 }).then((a) => a.entries[0]);

    const embed = new Embed()
      .setAuthor({
        name: `${entry.user?.tag} deleted an invite ${invite.code}`,
        iconURL: entry.user?.avatarURL(),
      })
      .setColor(0xed4245)
      .setTimestamp(new Date().toISOString());

      await this.client.getChannel<TextChannel>(channel)
        ?.createMessage({ embeds: [embed] })
        .catch(() => {});
  }

  public onLoad() {
    self = this;

    this.client.on('guildMemberAdd', this.onGuildMemberAdd);
    this.client.on('guildMemberRemove', this.onGuildMemberRemove);
    this.client.on('guildBanRemove', this.onGuildBanRemove);
    this.client.on('messageDelete', this.onMessageDelete);
    this.client.on('messageUpdate', this.onMessageUpdate);
    this.client.on('guildMemberUpdate', this.onGuildMemberUpdate);
    this.client.on('inviteCreate', this.onInviteCreate);
    this.client.on('inviteDelete', this.onInviteDelete);
  }

  public onUnload() {
    this.client.off('guildMemberAdd', this.onGuildMemberAdd);
    this.client.off('guildMemberRemove', this.onGuildMemberRemove);
    this.client.off('guildBanRemove', this.onGuildBanRemove);
    this.client.off('messageDelete', this.onMessageDelete);
    this.client.off('messageUpdate', this.onMessageUpdate);
    this.client.off('guildMemberUpdate', this.onGuildMemberUpdate);
    this.client.off('inviteCreate', this.onInviteCreate);
    this.client.off('inviteDelete', this.onInviteDelete);
  }
}
