module.exports = {
  name: "banbalance",
  group: "ZETCOINS_GROUP",
  description: "BANBALANCE_COMMAND_DESCRIPTION",
  usage: "BANBALANCE_COMMAND_USAGE",
  ownerOnly: true,
  async run(client, msg, args, prefix, language) {
    const userID = args.shift();
    const reason = args.join(" ");
    let user;
    if (msg.mentions.length) user = msg.mentions[0];
    else user = client.users.get(userID);

    if (!user) return msg.channel.createMessage(client.i18n.getTranslation(language, "INVALID_USER_PROVIDED"));

    const userBalance = (await zetCoins.findOrCreate({ where: { user: user.id } }))[0];
    if (userBalance.banned)
      return msg.channel.createMessage(client.i18n.getTranslation(language, "BALANCE_ALREADY_BANNED", user));

    await zetCoins.update({
      banned: true,
      reason,
      balance: 0,
    }, {
      where: { user: user.id },
    });

    const embed = {
      title: client.i18n.getTranslation(language, "BANBALANCE_EMBED_TITLE", user),
      description: client.i18n.getTranslation(language, "BANBALANCE_EMBED_DESCRIPTION", reason),
      color: 3066993,
    };
    await msg.channel.createMessage({ embed });
  }
};
