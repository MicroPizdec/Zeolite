const cooldowns = new Set();

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "work",
  group: "ZETCOINS_GROUP",
  description: "WORK_COMMAND_DESCRIPTION",
  async run (client, msg, args, prefix, language) {
    if (cooldowns.has(msg.author.id))
      return msg.channel.createMessage(client.i18n.getTranslation(language, "WORK_COOLDOWN"));
    
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
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
    };
    await msg.channel.createMessage({ embed });

    cooldowns.add(msg.author.id);
    setTimeout(() => cooldowns.delete(msg.author.id), 3600000);
  }
};
