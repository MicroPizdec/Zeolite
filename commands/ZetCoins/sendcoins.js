module.exports = {
  name: "sendcoins",
  group: "ZETCOINS_GROUP",
  description: "SENDCOINS_COMMAND_DESCRIPTION",
  usage: "SENDCOINS_COMMAND_USAGE",
  aliases: [ "pay" ],
  argsRequired: true,
  async run(client, msg, args, prefix, language) {
    if (!args.length)
      return msg.channel.createMessage(t(language, "SENDCOINS_NO_ARGS_PROMPT", prefix));

    const userID = args[0];
    const amount = Math.abs(parseFloat(args[1]));
    let user;

    if (!args[1])
      return msg.channel.createMessage(t(language, "SENDCOINS_NO_AMOUNT"));
    if (isNaN(amount))
      return msg.channel.createMessage(t(language, "SENDCOINS_AMOUNT_IS_NAN"));

    if (msg.mentions.length) user = msg.mentions[0];
    else user = await client.fetchUser(userID);

    if (!user) return msg.channel.createMessage(t(language, "INVALID_USER_PROVIDED"));

    if (user.id === msg.author.id) return msg.channel.createMessage(_(language, "CANNOT_SEND_COINS_TO_SELF"));

    if (user.bot) return msg.channel.createMessage(_(language, "CANNOT_SEND_COINS_TO_BOT"));

    const authorBalance = (await zetCoins.findOrCreate({ where: { user: msg.author.id } }))[0];
    const userBalance = (await zetCoins.findOrCreate({ where: { user: user.id } }))[0];
    
    if (authorBalance.banned) {
      const bannedBalanceEmbed = {
        title: t(language, "BANNED_BALANCE"),
        description: t(language, "BANNED_BALANCE_REASON", authorBalance.reason),
        color: 15158332,
      };
      return msg.channel.createMessage({ embed: bannedBalanceEmbed });
    }
    if (userBalance.banned)
      return msg.channel.createMessage(t(language, "BALANCE_ALREADY_BANNED", user));

    if (amount > authorBalance.balance)
      return msg.channel.createMessage(t(language, "SENDCOINS_NOT_ENOUGH_MONEY", authorBalance.balance));

    const confirmationEmbed = {
      title: t(language, "SENDCOINS_CONFIRMATION_TITLE", amount, user),
      description: t(language, "SENDCOINS_CONFIRMATION_DESCRIPTION"),
    };
    const message = await msg.channel.createMessage({ embed: confirmationEmbed });

    const response = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && (m.content == "yes" || m.content == "no"), { maxMatches: 1, time: 30000 } );
    if (response[0].content == "yes") {
      await zetCoins.update({
        balance: authorBalance.balance - amount,
      }, {
        where: { user: msg.author.id },
      });
      await zetCoins.update({
        balance: userBalance.balance + amount,
      }, {
        where: { user: user.id },
      });

      await message.edit({
        content: "",
        embed: {
          title: t(language, "SENDCOINS_SUCCESSFULLY_SENT", amount, user),
          color: 3066993,
        },
      });
    } else if (response[0].content == "no") {
      await message.edit({
        content: "",
        embed: {
          title: t(language, "SENDCOINS_CANCELLED_TRANSACTION"),
          color: 15158332,
        },
      });
    }
  }
};
