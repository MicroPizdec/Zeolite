module.exports = {
  name: "info",
  group: "BASIC_GROUP",
  description: "INFO_DESCRIPTION",
  async run(client, msg, args, prefix, lang) {
    let devs = [];
    [ "464348805899354113", "412503784455929857", "330153333962702850" ]
      .forEach(id => devs.push(client.users.get(id)));

    const inviteLink = "https://discord.com/oauth2/authorize?client_id=679692205736460301&scope=bot&permissions=8";

    const embed = {
      author: {
        name: "Zeolite",
        icon_url: client.user.avatarURL,
      },
      description: t(lang, "INFO_EMBED_DESC"),
      color: Math.round(Math.random() * 16777216),
      fields: [
        {
          name: t(lang, "INFO_DEVS"),
          value: devs.map(u => u.tag).join(", "),
        },
        {
          name: t(lang, "INFO_LINKS"),
          value: `[${t(lang, "INFO_INVITE")}](${inviteLink})\n` +
          `[${t(lang, "INFO_SUPPORT_SERVER")}](https://discord.gg/e6V38mv)\n` +
          `[${t(lang, "INFO_DONATE")}](https://www.donationalerts.com/r/zaribros)\n` +
          `[bots.server-discord.com](https://bots.server-discord.com/679692205736460301)\n` +
          `[top.gg](https://top.gg/bot/679692205736460301)\n` +
          `[botsfordiscord.com](https://botsfordiscord.com/bot/679692205736460301)`,
        },
      ],
    };

    await msg.channel.createMessage({ embed });
  }
}