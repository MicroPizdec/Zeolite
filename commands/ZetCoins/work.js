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
        color: await msg.author.embedColor(),
        footer: {
          text: `${client.user.username} © ZariBros`,
          icon_url: client.user.avatarURL,
        },
      };
      return msg.reply({ embed });
    }
    
    const amount = randInt(100, 400);

    const userBalance = (await zetCoins.findOrCreate({ where: { user: msg.author.id } }))[0];
    if (userBalance.banned) {
      const bannedBalanceEmbed = {
        title: t(language, "BANNED_BALANCE"),
        description: t(language, "BANNED_BALANCE_REASON", userBalance.reason),
        color: 15158332,
      };
      return msg.reply({ embed: bannedBalanceEmbed });
    }

    await userBalance.update({ balance: userBalance.balance + amount });

    const embed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL,
      },
      title: t(language, "WORK_EMBED_TITLE"),
      description: t(language, "WORK_EMBED_DESCRIPTION", amount, userBalance.balance ),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
    await msg.reply({ embed });

    cooldowns.set(msg.author.id, Date.now() + 3600000);
    setTimeout(() => cooldowns.delete(msg.author.id), 3600000);
  }
};
