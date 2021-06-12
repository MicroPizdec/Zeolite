module.exports = {
  name: "banbalance",
  group: "ZETCOINS_GROUP",
  description: "BANBALANCE_COMMAND_DESCRIPTION",
  usage: "BANBALANCE_COMMAND_USAGE",
  aliases: [ "banbal" ],
  ownerOnly: true,
  argsRequired: true,
  async run(client, msg, args, prefix, language) {
    const userID = args.shift();
    const reason = args.join(" ");
    let user;
    if (msg.mentions.length) user = msg.mentions[0];
    else user = await client.fetchUser(userID);

    if (!user) return msg.reply(msg.t("INVALID_USER_PROVIDED"));

    const userBalance = (await zetCoins.findOrCreate({ where: { user: user.id } }))[0];
    if (userBalance.banned)
      return msg.reply(msg.t("BALANCE_ALREADY_BANNED", user));

    await zetCoins.update({
      banned: true,
      reason,
      balance: 0,
    }, {
      where: { user: user.id },
    });

    await deposit.update({ balance: 0 }, { where: { user: user.id } });

    const embed = {
      title: msg.t("BANBALANCE_EMBED_TITLE", user),
      description: msg.t("BANBALANCE_EMBED_DESCRIPTION", reason),
      color: 3066993,
    };
    await msg.reply({ embed });
  }
};
