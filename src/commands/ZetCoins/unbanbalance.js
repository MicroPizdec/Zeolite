module.exports = {
  name: "unbanbalance",
  group: "ZETCOINS_GROUP",
  description: "UNBANBALANCE_COMMAND_DESCRIPTION",
  usage: "UNBANBALANCE_COMMAND_USAGE",
  ownerOnly: true,
  async run(client, msg, args, prefix, language) {
    const userID = args[0];
    let user;
    if (msg.mentions.length) user = msg.mentions[0];
    else user = client.users.get(userID);

    if (!user) return msg.channel.createMessage(client.i18n.getTranslation(language, "INVALID_USER_PROVIDED"));

    await zetCoins.update({
      banned: false,
      reason: null,
    }, {
      where: { user: user.id },
    });

    await msg.channel.createMessage(client.i18n.getTranslation(language, "UNBANBALANCE_SUCCESSFUL_UNBAN", user));
  }
}
