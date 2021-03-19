module.exports = {
  name: "setbalance",
  group: "ZETCOINS_GROUP",
  description: "SETBALANCE_COMMAND_DESCRIPTION",
  usage: "SETBALANCE_COMMAND_USAGE",
  ownerOnly: true,
  hidden: true,
  argsRequired: true,
  async run(client, msg, args, prefix, language) {
    if (!args.length)
      return msg.reply(t(language, "SETBALANCE_NO_ARGS_PROMPT", prefix));

    let userID = args[0];
    const amount = parseFloat(args[1]);
    if (!args[1])
      return msg.reply(t(language, "SETBALANCE_NO_AMOUNT"));
    if (isNaN(amount))
      return msg.reply(t(language, "SETBALANCE_AMOUNT_IS_NAN"));
    
    let user;
    if (msg.mentions.length) user = msg.mentions[0];
    else user = await client.users.get(userID);

    const userBalance = (await zetCoins.findOrCreate({ where: { user: user.id } }))[0];
    if (userBalance.banned)
      return msg.reply(t(language, "BALANCE_ALREADY_BANNED", user));

    if (!user) return msg.reply(t(language, "INVALID_USER_PROVIDED"));

    await zetCoins.update({
      balance: amount,
    }, {
      where: { user: user.id },
    });

    const embed = {
      title: t(language, "SETBALANCE_EMBED_TITLE", user),
      description: t(language, "SETBALANCE_EMBED_DESCRIPTION", amount),
      color: 3066993,
    };
    await msg.reply({ embed });
  }
}
