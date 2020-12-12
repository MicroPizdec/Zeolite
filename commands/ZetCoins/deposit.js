module.exports = {
  name: "deposit",
  group: "ZETCOINS_GROUP",
  description: "DEPOSIT_DESCRIPTION",
  aliases: [ "dep" ],
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      const embed = {
        title: t(lang, "DEPOSIT_EMBED_TITLE"),
        description: t(lang, "DEPOSIT_EMBED_DESC"),
        color: Math.round(Math.random() * 16777216),
        fields: [
          {
            name: t(lang, "DEPOSIT_USAGE"),
            value: t(lang, "DEPOSIT_USAGE_DESC", prefix),
          },
        ],
        footer: {
          text: `${client.user.username} © ZariBros`,
          icon_url: client.user.avatarURL,
        },
      };

      return msg.channel.createMessage({ embed });
    }

    const [ subcommand, sum ] = args;

    if (subcommand != "put" && subcommand != "wd") return;

    const intSum = Math.floor(parseFloat(sum));
    if (!intSum || intSum <= 0) {
      return msg.channel.createMessage(t(lang, "DEPOSIT_INVALID_SUM"));
    }

    const userBal = await zetCoins.findOrCreate({ where: { user: msg.author.id } })
      .then(b => b[0]);
    const dep = await deposit.findOrCreate({ where: { user: msg.author.id } })
      .then(d => d[0]);

    if (subcommand == "put") {
      if (intSum > userBal.balance) {
        return msg.channel.createMessage(t(lang, "DEPOSIT_NOT_ENOUGH_MONEY", userBal.balance));
      }

      await dep.update({ balance: dep.balance + intSum });
      await userBal.update({ balance: userBal.balance - intSum });

      const embed = {
        title: t(lang, "DEPOSIT_PUT_SUCCESS"),
        description: t(lang, "BALANCE_EMBED_DESCRIPTION", intSum),
        color: Math.round(Math.random() * 16777216),
        fields: [
          {
            name: t(lang, "DEPOSIT_TOTAL"),
            value: t(lang, "BALANCE_EMBED_DESCRIPTION", dep.balance),
          },
        ],
        footer: {
          text: `${client.user.username} © ZariBros`,
          icon_url: client.user.avatarURL,
        },
      };

      await msg.channel.createMessage({ embed });
    } else {
      if (intSum > dep.balance) {
        return msg.channel.createMessage(t(lang, "DEPOSIT_NOT_ENOUGH_DEPOSIT", dep.balance));
      }

      await dep.update({ balance: dep.balance - intSum });
      await userBal.update({ balance: userBal.balance + intSum });

      const embed = {
        title: t(lang, "DEPOSIT_WD_SUCCESS"),
        description: t(lang, "BALANCE_EMBED_DESCRIPTION", intSum),
        color: Math.round(Math.random() * 16777216),
        fields: [
          {
            name: t(lang, "DEPOSIT_TOTAL"),
            value: t(lang, "BALANCE_EMBED_DESCRIPTION", dep.balance),
          },
        ],
        footer: {
          text: `${client.user.username} © ZariBros`,
          icon_url: client.user.avatarURL,
        },
      };

      await msg.channel.createMessage({ embed });
    }
  }
}
