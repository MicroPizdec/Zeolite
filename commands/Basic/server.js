const moment = require("moment");
const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");
const { stripIndents } = require("common-tags");

module.exports = {
  name: "server",
  group: "BASIC_GROUP",
  description: "SERVERINFO_COMMAND_DESCRIPTION",
  guildOnly: true,
  aliases: [ "s", "serverinfo"],
  async run(client, msg, args, prefix, lang) {
    moment.locale(lang);
    const guild = client.owners.includes(msg.author.id) ?
      client.guilds.get(args[0]) || msg.guild : msg.guild;

    const createdDaysAgo = Math.floor((Date.now() - guild.createdAt) / (86400 * 1000));
    const joinedDaysAgo = Math.floor((Date.now() - msg.member.joinedAt) / (86400 * 1000));

    const boostersCount = guild.members.filter(m => m.premiumSince).length;

    let owner = guild.members.get(guild.ownerID)
    || await client.fetchUser(guild.ownerID);

    const embed = {
      author: {
        name: guild.name,
      },
      description: guild.description,
      color: await msg.author.embedColor(),
      thumbnail: { url: guild.iconURL },
      footer: {
        text: t(lang, "SERVERINFO_FOOTER", guild.id) + " " + t(lang, "DAYS_AGO", createdDaysAgo),
      },
      timestamp: new Date(guild.createdAt).toISOString(),
      fields: [
        {
          name: t(lang, "SERVERINFO_OWNER"),
          value: owner.tag,
        },
        {
          name: t(lang, "SERVERINFO_VERIFICATION_LEVEL"),
          value: t(lang, "SERVERINFO_VERIFICATION_LEVELS")[guild.verificationLevel],
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
          name: t(lang, "SERVERINFO_BOOST_LEVEL"),
          value: guild.premiumTier,
          inline: true,
        },
      ],
    };

    if (guild.premiumSubscriptionCount) embed.fields.push({
      name: t(lang, "SERVERINFO_BOOST_COUNT"),
      value: guild.premiumSubscriptionCount,
      inline: true,
    });

    if (boostersCount) embed.fields.push({
      name: t(lang, "SERVERINFO_BOOSTERS"),
      value: boostersCount,
      inline: true,
    });

    if (guild.features.length) embed.fields.push({
      name: t(lang, "SERVERINFO_FEAUTURES"),
      value: guild.features.map(f => t(lang, "FEATURES")[f]).join(", "),
    });

    await msg.reply({ embed })
  }
};
