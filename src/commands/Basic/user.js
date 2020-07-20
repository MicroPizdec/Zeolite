const strftime = require("strftime");

module.exports = {
  name: "user",
  group: "BASIC_GROUP",
  description: "USERINFO_COMMAND_DESCRIPTION",
  usage: "USERINFO_COMMAND_USAGE",
  async run(client, msg, args, prefix, language) {
    let member;
    let userID = args[0];
    
    if (!userID) member = msg.member;
    else member = msg.channel.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
      msg.channel.guild.members.get(userID);

    if (!member) return;

    const userBalance = (await zetCoins.findOrCreate({ where: { user: member.id } }))[0];

    const createdDaysAgo = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));
    
    const roleList = Array.from(member.roleObjects.values())
      .sort((a, b) => b.position - a.position)
      .map(r => r.mention)
      .join(", ");

    const embed = {
      title: member.username + "#" + member.discriminator,
      thumbnail: { url: member.avatarURL },
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
      fields: [
        {
          name: "ID",
          value: member.id,
        },
        {
          name: client.i18n.getTranslation(language, "USERINFO_STATUS"),
          value: member.status,
        },
        {
          name: client.i18n.getTranslation(language, "USERINFO_REGDATE"),
          value: strftime("%e/%m/%Y, %H:%M", new Date(member.createdAt)) + " " + _(language, "USERINFO_CREATED_DAYS_AGO", createdDaysAgo),
        },
        {
          name: client.i18n.getTranslation(language, "USERINFO_ROLES"),
          value: roleList || "None",
        },
        {
          name: client.i18n.getTranslation(language, "USERINFO_BOT_TITLE"),
          value: client.i18n.getTranslation(language, "USERINFO_BOT_DEFINE", member.bot),
        },
        {
          name: client.i18n.getTranslation(language, "USERINFO_ZETCOINS_TITLE"),
          value: client.i18n.getTranslation(language, "USERINFO_ZETCOINS_BALANCE", userBalance.balance),
        }
      ],
    };
    await msg.channel.createMessage({ embed });
  }
}
