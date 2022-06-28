import {
  Guild,
  Member,
  MemberPartial,
  GuildAuditLogEntry,
  User,
  PossiblyUncachedMessage,
  Message,
  OldMessage,
  OldMember,
  Invite,
} from 'eris';
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

  async onGuildMemberAdd(guild: Guild, member: Member) {
    const channel = await self.getModlogsChannel(member.guild.id);
    if (!channel) return;

    const createdDays = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));

    const embed = new Embed()
      .setAuthor({
        name: `${member.user.username}#${member.user.discriminator} joined the server`,
        icon_url: member.avatarURL,
      })
      .setColor(0x57f287)
      .addField('Registered at', `<t:${Math.floor((member.createdAt as number) / 1000)}> (${createdDays} days ago)`)
      .setFooter({ text: `ID: ${member.user.id}` })
      .setTimestamp(new Date().toISOString());

    if (member.user.bot) {
      embed.setAuthor({
        name: `${member.user.username}#${member.user.discriminator} has been added to this server`,
        icon_url: member.avatarURL,
      });
      if (guild.members.get(self.client.user.id)?.permissions.has('viewAuditLog')) {
        const entry = await guild.getAuditLog({ actionType: 28 }).then((a) => a.entries[0]);

        embed.addField('Added by', `${entry.user.username}#${entry.user.discriminator} (${entry.user.id})`);
      }
    }

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
  }

  async onGuildMemberRemove(guild: Guild, member: Member | MemberPartial) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    let entry: GuildAuditLogEntry | undefined;
    if (guild.members.get(self.client.user.id)?.permissions.has('viewAuditLog')) {
      entry = await guild.getAuditLog().then((l) => l.entries.find((e) => e.actionType == 20 || e.actionType == 22));
    }

    const embed = new Embed()
      .setAuthor({
        name: `${member.user.username}#${member.user.discriminator} left the server`,
        icon_url: member.user.avatarURL,
      })
      .setColor(0xed4245)
      .setFooter({ text: `ID: ${member.user.id}` })
      .setTimestamp(new Date().toISOString());

    if (entry) {
      if (entry.actionType == 20) {
        embed
          .setAuthor({
            name: `${member.user.username}#${member.user.discriminator} was kicked`,
            icon_url: member.user.avatarURL,
          })
          .setDescription(`Reason: ${entry.reason || 'None'}`)
          .addField('Kicked by', `${entry.user.username}#${entry.user.discriminator}`);
      } else if (entry.actionType == 22) {
        embed
          .setAuthor({
            name: `${member.user.username}#${member.user.discriminator} was banned`,
            icon_url: member.user.avatarURL,
          })
          .setDescription(`Reason: ${entry.reason || 'None'}`)
          .addField('Banned by', `${entry.user.username}#${entry.user.discriminator}`);
      }
    }

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
  }

  async onGuildBanRemove(guild: Guild, user: User) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    let entry: GuildAuditLogEntry | undefined;
    if (guild.members.get(self.client.user.id)?.permissions.has('viewAuditLog')) {
      entry = await guild.getAuditLog({ actionType: 23 }).then((l) => l.entries[0]);
    }

    const embed = new Embed()
      .setAuthor({
        name: `${user.username}#${user.discriminator} was unbanned`,
        icon_url: user.avatarURL,
      })
      .setColor(0xf1c40f)
      .setFooter({ text: `ID: ${user.id} ` })
      .setTimestamp(new Date().toISOString());

    if (entry) {
      embed.addField('Unbanned by', `${entry.user.username}#${entry.user.discriminator}`);
    }

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
  }

  async onMessageDelete(msg: Message) {
    if (!msg.guildID) return;
    const channel = await self.getModlogsChannel(msg.guildID);
    if (!channel) return;

    if (!msg.author) return;
    if (msg.author.bot) return;
    if (!msg.content) return;

    const embed = new Embed()
      .setTitle('Message deleted')
      .setDescription(msg.content)
      .setColor(0xed4245)
      .addField('Author', `${msg.author.username}#${msg.author.discriminator} (${msg.author.mention})`)
      .addField('Channel', `${msg.channel.mention}`)
      .setFooter({ text: `Message ID: ${msg.id}` })
      .setTimestamp(new Date().toISOString());

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
  }

  async onMessageUpdate(msg: Message, oldMsg: OldMessage) {
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
      .addField('Channel', `${msg.channel.mention}`)
      .setFooter({ text: `Message ID: ${msg.id}` })
      .setTimestamp(new Date().toISOString());

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
  }

  async onGuildMemberUpdate(guild: Guild, member: Member, oldMember: OldMember | null) {
    if (!oldMember) return;

    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    const embed = new Embed();

    if (oldMember.nick != member.nick) {
      embed
        .setAuthor({
          name: `${member.username}#${member.discriminator}`,
          icon_url: member.avatarURL,
        })
        .setTitle('Nickname changed')
        .setColor(0xf1c40f)
        .addField('Old nickname', oldMember.nick || member.username, true)
        .addField('New nickname', member.nick || member.username, true)
        .setFooter({ text: `Member ID: ${member.user.id}` })
        .setTimestamp(new Date().toISOString());

      if (guild.members.get(self.client.user.id)?.permissions.has('viewAuditLog')) {
        const entry = await guild.getAuditLog({ actionType: 24 }).then((a) => a.entries[0]);

        if (entry?.target?.id == member.id) {
          embed.addField('Changed by', `${entry.user.username}#${entry.user.discriminator}`);
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
          icon_url: member.avatarURL,
        })
        .setTitle('Member roles changed')
        .setColor(0xf1c40f)
        .addField(addedRoles.length ? 'Role added' : 'Role removed', `<@&${role}>`)
        .setFooter({ text: `Member ID: ${member.user.id}` })
        .setTimestamp(new Date().toISOString());
    }

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
  }

  async onInviteCreate(guild: Guild, invite: Invite) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    const embed = new Embed()
      .setAuthor({
        name: `${invite.inviter?.username}#${invite.inviter?.discriminator} created an invite ${invite.code}`,
        icon_url: invite.inviter?.avatarURL,
      })
      .setDescription(`Channel: #${invite.channel.name}`)
      .setColor(0x57f287)
      .setTimestamp(new Date().toISOString());

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
  }

  async onInviteDelete(guild: Guild, invite: Invite) {
    const channel = await self.getModlogsChannel(guild.id);
    if (!channel) return;

    if (guild.members.get(self.client.user.id)?.permissions.has('viewAuditLog')) return;
    const entry = await guild.getAuditLog({ actionType: 42 }).then((a) => a.entries[0]);

    const embed = new Embed()
      .setAuthor({
        name: `${entry.user.username}#${entry.user.discriminator} deleted an invite ${invite.code}`,
        icon_url: entry.user.avatarURL,
      })
      .setColor(0xed4245)
      .setTimestamp(new Date().toISOString());

    await self.client.createMessage(channel, { embeds: [embed] }).catch(() => {});
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
