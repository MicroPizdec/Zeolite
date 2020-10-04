module.exports = {
  name: "top",
  group: "ZETCOINS_GROUP",
  description: "TOP_COMMAND_DESCRIPTION",
  async run(client, msg, args, prefix, language) {
    let balances = await zetCoins.findAll();
    balances.sort((a, b) => b.balance - a.balance);
    balances = balances.slice(0, 10).filter(b => msg.guild.members.has(b.user));

    const embed = {
      title: client.i18n.getTranslation(language, "TOP_EMBED_TITLE"),
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [],
      footer: {
        text: `${client.user.username} © 2019-2020 ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };

    let number = 1;
    for (let bal of balances) {
      let { tag } = msg.guild.members.get(bal.user)
      embed.fields.push({
        name: `${number}: ${tag}`,
        value: _(language, "TOP_BALANCE", bal.balance),
      });

      number++;
    }

    await msg.channel.createMessage({ embed });
  }
}
