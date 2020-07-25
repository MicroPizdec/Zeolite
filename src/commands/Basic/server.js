const strftime = require("strftime");

module.exports = {
  name: "server",
  group: "BASIC_GROUP",
  description: "SERVERINFO_COMMAND_DESCRIPTION",
  guildOnly: true,
  aliases: [ "s", "serverinfo" ],
  async run(client, msg, args, prefix, language) {
    const createdDaysAgo = Math.floor((Date.now() - msg.guild.createdAt) / (86400 * 1000));
    const joinedDaysAgo = Math.floor((Date.now() - msg.member.joinedAt) / (86400 * 1000));

    const embed = {
      title: msg.channel.guild.name,
      thumbnail: { url: msg.channel.guild.iconURL },
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
      fields: [
        {
          name: client.i18n.getTranslation(language, "SERVERINFO_CREATION_DATE"),
          value: strftime("%e/%m/%Y, %H:%M", new Date(msg.channel.guild.createdAt)) + " " + _(language, "USERINFO_CREATED_DAYS_AGO", createdDaysAgo),
        },
        {
          name: "ID",
          value: msg.channel.guild.id,
        },
        {
          name: client.i18n.getTranslation(language, "SERVERINFO_DATE_OF_YOUR_JOIN"),
          value: strftime("%e/%m/%Y, %H:%M", new Date(msg.member.joinedAt)) + " " + _(language, "USERINFO_CREATED_DAYS_AGO", joinedDaysAgo),
        },
        {
          name: client.i18n.getTranslation(language, "SERVERINFO_CHANNELS"),
          value: msg.channel.guild.channels.size,
        },
        {
          name: client.i18n.getTranslation(language, "SERVERINFO_MEMBERS"),
          value: msg.channel.guild.members.size,
        },
        {
          name: client.i18n.getTranslation(language, "SERVERINFO_BOTS"),
          value: msg.channel.guild.members.filter(m => m.bot).length,
        },
        {
          name: client.i18n.getTranslation(language, "SERVERINFO_ROLES"),
          value: msg.channel.guild.roles.size,
        },
        {
          name: client.i18n.getTranslation(language, "SERVERINFO_REGION"),
          value: msg.channel.guild.region,
        },
      ],
    };
    await msg.channel.createMessage({ embed })
  }
};
