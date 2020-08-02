const strftime = require("strftime");
const { stripIndents } = require("common-tags");
const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");

module.exports = {
  name: "server",
  group: "BASIC_GROUP",
  description: "SERVERINFO_COMMAND_DESCRIPTION",
  guildOnly: true,
  aliases: [ "s", "serverinfo" ],
  async run(client, msg, args, prefix, language) {
    const createdDaysAgo = Math.floor((Date.now() - msg.guild.createdAt) / (86400 * 1000));
    const joinedDaysAgo = Math.floor((Date.now() - msg.member.joinedAt) / (86400 * 1000));

    const owner = await client.fetchUser(msg.guild.ownerID);

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
          name: _(language, "SERVERINFO_OWNER"),
          value: owner.tag,
          inline: true,
        },
        {
          name: _(language, "SERVERINFO_CHANNELS"),
          value: stripIndents`${_(language, "SERVERINFO_CHANNELS_CATEGORIES")} - ${msg.guild.channels.filter(c => c instanceof CategoryChannel).length}
            ${_(language, "SERVERINFO_CHANNELS_TEXT")} - ${msg.guild.channels.filter(c => c instanceof TextChannel).length}
            ${_(language, "SERVERINFO_CHANNELS_VOICE")} - ${msg.guild.channels.filter(c => c instanceof VoiceChannel).length}
            ${_(language, "SERVERINFO_CHANNELS_TOTAL")} - ${msg.guild.channels.size}`,
          inline: true,
        },
        {
          name: _(language, "SERVERINFO_MEMBERS"),
        },
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
      ],
    };
    await msg.channel.createMessage({ embed })
  }
};
