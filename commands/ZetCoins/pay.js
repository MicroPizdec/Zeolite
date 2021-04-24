const { ZETCOINS_GROUP } = require("../../locales/en");

module.exports = {
  name: "pay",
  group: "ZETCOINS_GROUP",
  description: "SENDCOINS_COMMAND_DESCRIPTION",
  usage: "SENDCOINS_COMMAND_USAGE",
  aliases: [ "sendcoins" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    let [ userID, sum ] = args;

    const user = msg.mentions.length ? msg.mentions[0] :
      client.users.find(u => u.tag == userID || u.id == userID);
    
    if (!user) {
      return msg.reply(t(lang, "INVALID_USER_PROVIDED"));
    }

    if (user.id == msg.author.id) {
      return msg.reply(t(lang, "CANNOT_SEND_COINS_TO_SELF"));
    }

    if (user.bot) {
      return msg.reply(t(lang, "CANNOT_SEND_COINS_TO_BOT"));
    }

    if (!sum || sum <= 0) {
      return msg.reply(t(lang, "SENDCOINS_NO_AMOUNT"));
    }

    if (isNaN(sum)) {
      return msg.reply(t(lang, "SENDCOINS_AMOUNT_IS_NAN"));
    }

    sum = Math.round(sum);

    const authorBalance = await zetCoins.findOrCreate({ where: { user: msg.author.id } })
      .then(b => b[0]);
    const userBalance = await zetCoins.findOrCreate({ where: { user: user.id } })
      .then(b => b[0]);

    if (authorBalance.banned) {
      const bannedBalanceEmbed = {
        title: t(lang, "BANNED_BALANCE"),
        description: t(lang, "BANNED_BALANCE_REASON", authorBalance.reason),
        color: 15158332,
      };
      return msg.reply({ embed: bannedBalanceEmbed });
    }
    
    if (authorBalance.balance < sum) {
      return msg.reply(t(lang, "SENDCOINS_NOT_ENOUGH_MONEY", authorBalance.balance));
    }

    if (userBalance.banned) {
      return msg.reply(t(lang, "CANNOT_SEND_COINS_TO_BANNED_BALANCE"));
    }

    const confirmEmbed = {
      title: t(lang, "SENDCOINS_CONFIRMATION_TITLE", sum, user),
      description: t(lang, "SENDCOINS_CONFIRMATION_DESCRIPTION"),
      color: await msg.author.embedColor(),
    };

    const message = await msg.reply({ embed: confirmEmbed });
    
    const response = await msg.channel.awaitMessages(
      m => m.author == msg.author && ((m.content == "y" || m.content == "yes") || (m.content == "n" || m.content == "no")),
      { time: 30000, maxMatches: 1 }
    );
    if (!response.length) {
      const embed = {
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL,
        },
        description: t(lang, "SENDCOINS_TIME_EXPIRED"),
        color: await msg.author.embedColor(),
      };

      return message.edit({ embed });
    } else if (response[0].content == "y" || response[0].content == "yes") {
      await userBalance.update({ balance: userBalance.balance + sum });
      await authorBalance.update({ balance: authorBalance.balance - sum });

      const embed = {
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL,
        },
        description: t(lang, "SENDCOINS_SUCCESSFULLY_SENT", sum, user),
        color: await msg.author.embedColor(),
      };

      return message.edit({ embed });
    } else {
      const embed = {
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL,
        },
        description: t(lang, "SENDCOINS_CANCELLED_TRANSACTION"),
        color: await msg.author.embedColor(),
      };

      return message.edit({ embed });
    }
  }
}