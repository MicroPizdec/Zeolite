module.exports = {
  name: "info",
  group: "BASIC_GROUP",
  description: "INFO_DESCRIPTION",
  async run(client, msg, args, prefix, lang) {
    const devs = client.users.filter(u => [ "412503784455929857", "464348805899354113", "330153333962702850" ].includes(u.id))
      .map(u => u.tag).reverse().join(", ");

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
          value: devs,
        },
        {
          name: t(lang, "INFO_LINKS"),
          value: `[${t(lang, "INFO_INVITE")}](${inviteLink})\n` +
          `[${t(lang, "INFO_SUPPORT_SERVER")}](https://discord.gg/e6V38mv)\n` +
          `[${t(lang, "INFO_DONATE")}](https://www.donationalerts.com/r/zaribros)`,
        },
      ],
    };

    await msg.channel.createMessage({ embed });
  }
}
