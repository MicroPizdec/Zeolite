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
    const guild = client.owners.includes(msg.author.id) ?
      client.guilds.get(args[0]) || msg.guild : msg.guild;

    const createdDaysAgo = Math.floor((Date.now() - guild.createdAt) / (86400 * 1000));
    const joinedDaysAgo = Math.floor((Date.now() - msg.member.joinedAt) / (86400 * 1000));

    const embed = {
      author: {
        name: guild.name,
        icon_url: guild.iconURL,
      },
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
      fields: [
        {
          name: "ID",
          value: guild.id,
        },
        {
          name: t(lang, "SERVERINFO_CREATION_DATE"),
          value: strftime("%e %b %Y, %H:%M", new Date(guild.createdAt)) + " " + _(lang, "USERINFO_CREATED_DAYS_AGO", createdDaysAgo),
        },
        {
          name: t(lang, "SERVERINFO_CHANNELS"),
          value: stripIndents`${t(lang, "SERVERINFO_TEXT")} - ${guild.channels.filter(c => c instanceof TextChannel).length}
          ${t(lang, "SERVERINFO_VOICE")} - ${guild.channels.filter(c => c instanceof VoiceChannel).length}
          ${t(lang, "SERVERINFO_CATEGORIES")} - ${guild.channels.filter(c => c instanceof CategoryChannel).length}`,
          inline: true,
        },
        {
          name: t(lang, "SERVERINFO_MEMBERS"),
          value: stripIndents`${t(lang, "SERVERINFO_MEMBERS_BOTS")} - ${guild.members.filter(m => m.bot).length}
          ${t(lang, "SERVERINFO_MEMBERS_TOTAL")} - ${guild.memberCount}`,
          inline: true,
        },
        {
          name: t(lang, "SERVERINFO_EMOJIS"),
          value: stripIndents`${t(lang, "SERVERINFO_EMOJIS_STATIC")} - ${guild.emojis.filter(e => !e.animated).length}
            ${t(lang, "SERVERINFO_EMOJIS_ANIMATED")} - ${guild.emojis.filter(e => e.animated).length}
            ${t(lang, "SERVERINFO_EMOJIS_TOTAL")} - ${guild.emojis.length}`,
          inline: true,
        },
        {
          name: t(lang, "SERVERINFO_ROLES"),
          value: guild.roles.size,
        },
        {
          name: t(lang, "SERVERINFO_REGION"),
          value: guild.region,
        },
      ],
    };
    await msg.channel.createMessage({ embed })
  }
};
