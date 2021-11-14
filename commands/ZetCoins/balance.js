module.exports = {
  name: "balance",
  group: "ZETCOINS_GROUP",
  description: "BALANCE_COMMAND_DESCRIPTION",
  usage: "BALANCE_COMMAND_USAGE",
  aliases: [ "bal" ],
  async run(client, msg, args, prefix, language) {
    let userID = args[0];

    const user = userID ? msg.mentions.length ?
      msg.guild.members.get(msg.mentions[0].id) :
      msg.guild.members.find(m =>
        m.nick && m.nick.toLowerCase().startsWith(userID.toLowerCase()) ||
        m.tag.toLowerCase().startsWith(userID.toLowerCase()) ||
        m.id == userID
      ) : msg.member;

    if (!user) return;

    const userBalance = (await zetCoins.findOrCreate({ where: { user: user.id } }))[0];
    const userDeposit = (await deposit.findOrCreate({ where: { user: user.id } }))[0];

    if (userBalance.banned) {
      const bannedBalanceEmbed = {
        title: msg.t("BANNED_BALANCE"),
        description: msg.t("BANNED_BALANCE_REASON", userBalance.reason),
        color: 15158332,
      };
      return msg.reply({ embed: bannedBalanceEmbed });
    }

    const embed = {
      author: {
        name: msg.t("BALANCE_EMBED_AUTHOR_NAME", user),
        icon_url: user.avatarURL,
      },
      description: msg.t("BALANCE_EMBED_DESCRIPTION", userBalance.balance),
      color: await msg.author.embedColor(),
      fields: [
        {
          name: msg.t("BALANCE_DEPOSIT"),
          value: msg.t("BALANCE_EMBED_DESCRIPTION", userDeposit.balance),
        },
      ],
      footer: {
        text: `${client.user.username} © Fishyrene`,
        icon_url: client.user.avatarURL,
      },
    };
    await msg.reply({ embed });
  }
};
