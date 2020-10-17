const cooldowns = new Map();

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "work",
  group: "ZETCOINS_GROUP",
  description: "WORK_COMMAND_DESCRIPTION",
  async run (client, msg, args, prefix, language) {
    if (cooldowns.has(msg.author.id)) {
      const cooldown = cooldowns.get(msg.author.id);
      const minsLeft = Math.ceil((cooldown - Date.now()) / 60000);

      const embed = {
        title: t(language, "WORK_COOLDOWN_TITLE"),
        description: t(language, "WORK_COOLDOWN_DESC", minsLeft),
        color: Math.round(Math.random() * 16777216),
        footer: {
          text: `${client.user.username} © 2019-2020 ZariBros`,
          icon_url: client.user.avatarURL,
        },
      };
      return msg.channel.createMessage({ embed });
    }
    
    const amount = randInt(100, 400);

    const userBalance = (await zetCoins.findOrCreate({ where: { user: msg.author.id } }))[0];
    if (userBalance.banned) {
      const bannedBalanceEmbed = {
        title: client.i18n.getTranslation(language, "BANNED_BALANCE"),
        description: client.i18n.getTranslation(language, "BANNED_BALANCE_REASON", userBalance.reason),
        color: 15158332,
      };
      return msg.channel.createMessage({ embed: bannedBalanceEmbed });
    }

    await zetCoins.update({
      balance: userBalance.balance + amount,
    }, {
      where: { user: msg.author.id },
    });

    const embed = {
      title: client.i18n.getTranslation(language, "WORK_EMBED_TITLE"),
      description: client.i18n.getTranslation(language, "WORK_EMBED_DESCRIPTION", amount),
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: `${client.user.username} © 2019-2020 ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
    await msg.channel.createMessage({ embed });

    cooldowns.set(msg.author.id, Date.now() + 3600000);
    setTimeout(() => cooldowns.delete(msg.author.id), 3600000);
  }
};
