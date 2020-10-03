const strftime = require("strftime");
const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");
const { stripIndents } = require("common-tags");

module.exports = {
  name: "server",
  group: "BASIC_GROUP",
  description: "SERVERINFO_COMMAND_DESCRIPTION",
  guildOnly: true,
  aliases: [ "s", "serverinfo" ],
  async run(client, msg, args, prefix, lang) {
    const createdDaysAgo = Math.floor((Date.now() - msg.guild.createdAt) / (86400 * 1000));
    const joinedDaysAgo = Math.floor((Date.now() - msg.member.joinedAt) / (86400 * 1000));

    const embed = {
      author: {
        name: msg.guild.name,
        icon_url: msg.guild.iconURL,
      },
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: `${client.user.username} © 2019-2020 ZariBros`,
        icon_url: client.user.avatarURL,
      },
      fields: [
        {
          name: "ID",
          value: msg.guild.id,
        },
        {
          name: t(lang, "SERVERINFO_CREATION_DATE"),
          value: strftime("%e %b %Y, %H:%M", new Date(msg.guild.createdAt)) + " " + _(lang, "USERINFO_CREATED_DAYS_AGO", createdDaysAgo),
        },
        {
          name: t(lang, "SERVERINFO_CHANNELS"),
          value: stripIndents`${t(lang, "SERVERINFO_TEXT")} - ${msg.guild.channels.filter(c => c instanceof TextChannel).length}
          ${t(lang, "SERVERINFO_VOICE")} - ${msg.guild.channels.filter(c => c instanceof VoiceChannel).length}
          ${t(lang, "SERVERINFO_CATEGORIES")} - ${msg.guild.channels.filter(c => c instanceof CategoryChannel).length}`,
          inline: true,
        },
        {
          name: t(lang, "SERVERINFO_MEMBERS"),
          value: stripIndents`${t(lang, "SERVERINFO_MEMBERS_ONLINE")} - ${msg.guild.members.filter(m => m.status == "online").length}
          ${t(lang, "SERVERINFO_MEMBERS_IDLE")} - ${msg.guild.members.filter(m => m.status == "idle").length}
          ${t(lang, "SERVERINFO_MEMBERS_DND")} - ${msg.guild.members.filter(m => m.status == "dnd").length}
          ${t(lang, "SERVERINFO_MEMBERS_OFFLINE")} - ${msg.guild.members.filter(m => m.status == "offline").length}
          ${t(lang, "SERVERINFO_MEMBERS_BOTS")} - ${msg.guild.members.filter(m => m.bot).length}
          ${t(lang, "SERVERINFO_MEMBERS_TOTAL")} - ${msg.guild.memberCount}`,
          inline: true,
        },
        {
          name: t(lang, "SERVERINFO_ROLES"),
          value: msg.guild.roles.size,
        },
        {
          name: t(lang, "SERVERINFO_REGION"),
          value: msg.guild.region,
        },
      ],
    };
    await msg.channel.createMessage({ embed })
  }
};
