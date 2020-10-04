module.exports = {
  name: "dice",
  group: "ZETCOINS_GROUP",
  description: "DICE_COMMAND_DESCRIPTION",
  usage: "DICE_COMMAND_USAGE",
  async run(client, msg, args, prefix, language) {
    if (!args.length)
      return msg.channel.createMessage(_(language, "DICE_NO_ARGS_PROMPT", prefix));
    
    const amount = Math.floor(Math.abs(parseFloat(args[0])));
    const chance = Math.random() < 0.5;

    const userBalance = (await zetCoins.findOrCreate({ where: { user: msg.author.id } }))[0];
    if (amount > userBalance.balance)
      return msg.channel.createMessage(_(language, "DICE_NOT_ENOUGH_MONEY", userBalance.balance));
    if (isNaN(amount))
      return msg.channel.createMessage(_(language, "DICE_AMOUNT_IS_NAN"));
    if (amount === 0)
      return msg.channel.createMessage(_(language, "DICE_MORE_THAN_ZERO"));

    const winEmbed = {
      author: {
        name: `${msg.author.username}#${msg.author.discriminator}`,
        icon_url: msg.author.avatarURL,
      },
      title: _(language, "DICE_WIN"),
      description: _(language, "DICE_WIN_MESSAGE", amount, userBalance.balance),
      color: 0x1cac78,
      footer: {
        text: `${client.user.username} © 2019-2020 ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
    const lossEmbed = {
      author: {
        name: `${msg.author.username}#${msg.author.discriminator}`,
        icon_url: msg.author.avatarURL,
      },
      title: _(language, "DICE_LOSS"),
      description: _(language, "DICE_LOSS_MESSAGE", amount, userBalance.balance),
      color: 0xcc0605,
      footer: {
        text: `${client.user.username} © 2019-2020 ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };

    if (!chance) {
      await zetCoins.update({
        balance: userBalance.balance - amount,
      }, { where: { user: msg.author.id } });
      await msg.channel.createMessage({ embed: lossEmbed });
    } else {
      await zetCoins.update({
        balance: userBalance.balance + amount,
      }, { where: { user: msg.author.id } });
      await msg.channel.createMessage({ embed: winEmbed });
    }
  }
};
