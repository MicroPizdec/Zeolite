module.exports = {
  name: "setbalance",
  group: "ZETCOINS_GROUP",
  description: "SETBALANCE_COMMAND_DESCRIPTION",
  usage: "SETBALANCE_COMMAND_USAGE",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, language) {
    if (!args.length)
      return msg.channel.createMessage(client.i18n.getTranslation(language, "SETBALANCE_NO_ARGS_PROMPT", prefix));

    let userID = args[0];
    const amount = parseFloat(args[1]);
    if (!args[1])
      return msg.channel.createMessage(client.i18n.getTranslation(language, "SETBALANCE_NO_AMOUNT"));
    if (isNaN(amount))
      return msg.channel.createMessage(client.i18n.getTranslation(language, "SETBALANCE_AMOUNT_IS_NAN"));
    
    let user;
    if (msg.mentions.length) user = msg.mentions[0];
    else user = await client.fetchUser(userID);

    const userBalance = (await zetCoins.findOrCreate({ where: { user: user.id } }))[0];
    if (userBalance.banned)
      return msg.channel.createMessage(client.i18n.getTranslation(language, "BALANCE_ALREADY_BANNED", user));

    if (!user) return msg.channel.createMessage(client.i18n.getTranslation(language, "INVALID_USER_PROVIDED"));

    await zetCoins.update({
      balance: amount,
    }, {
      where: { user: user.id },
    });

    const embed = {
      title: client.i18n.getTranslation(language, "SETBALANCE_EMBED_TITLE", user),
      description: client.i18n.getTranslation(language, "SETBALANCE_EMBED_DESCRIPTION", amount),
      color: 3066993,
    };
    await msg.channel.createMessage({ embed });
  }
}
