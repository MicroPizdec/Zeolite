module.exports = {
  name: "info",
  group: "BASIC_GROUP",
  description: "INFO_DESCRIPTION",
  aliases: [ "about" ],
  async run(client, msg, args, prefix, lang) {
    let devs = [];
    [ "464348805899354113", "412503784455929857", "800051176330231838" ]
      .forEach(id => devs.push(client.users.get(id)));

    const embed = {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      description: msg.t("INFO_EMBED_DESC"),
      color: await msg.author.embedColor(),
      fields: [
        {
          name: msg.t("INFO_DEVS"),
          value: devs.map(u => u.tag).join(", "),
        },
        {
          name: msg.t("INFO_LINKS"),
          value: `[${msg.t("INFO_INVITE")}](${await client.getInviteLink(8)})\n` +
          `[${msg.t("INFO_SUPPORT_SERVER")}](https://discord.gg/ZKChwBD)\n` +
          `[${msg.t("INFO_DONATE")}](https://www.donationalerts.com/r/zaribros)\n` +
          `[bots.server-discord.com](https://bots.server-discord.com/679692205736460301)\n` +
          `[top.gg](https://top.gg/bot/679692205736460301)\n` +
          `[botsfordiscord.com](https://botsfordiscord.com/bot/679692205736460301)\n` +
          `[boticord.top](https://boticord.top/bot/679692205736460301)`,
        },
      ],
    };

    await msg.reply({ embed });
  }
}
