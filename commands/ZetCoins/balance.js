module.exports = {
  name: "balance",
  group: "ZETCOINS_GROUP",
  description: "BALANCE_COMMAND_DESCRIPTION",
  usage: "BALANCE_COMMAND_USAGE",
  aliases: [ "bal" ],
  async run(client, msg, args, prefix, language) {
    let userID = args[0];

    const user = userID ? msg.mentions[0] || await client.fetchUser(userID) : msg.author;

    if (!user) return;

    const userBalance = (await zetCoins.findOrCreate({ where: { user: user.id } }))[0];
    if (userBalance.banned) {
      const bannedBalanceEmbed = {
        title: client.i18n.getTranslation(language, "BANNED_BALANCE"),
        description: client.i18n.getTranslation(language, "BANNED_BALANCE_REASON", userBalance.reason),
        color: 15158332,
      };
      return msg.channel.createMessage({ embed: bannedBalanceEmbed });
    }

    const embed = {
      author: {
        name: client.i18n.getTranslation(language, "BALANCE_EMBED_AUTHOR_NAME", user),
        icon_url: user.avatarURL,
      },
      description: client.i18n.getTranslation(language, "BALANCE_EMBED_DESCRIPTION", userBalance.balance),
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
    await msg.channel.createMessage({ embed });
  }
};
