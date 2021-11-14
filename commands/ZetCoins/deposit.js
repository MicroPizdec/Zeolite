module.exports = {
  name: "deposit",
  group: "ZETCOINS_GROUP",
  description: "DEPOSIT_DESCRIPTION",
  aliases: [ "dep" ],
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      const embed = {
        title: msg.t("DEPOSIT_EMBED_TITLE"),
        description: msg.t("DEPOSIT_EMBED_DESC"),
        color: await msg.author.embedColor(),
        fields: [
          {
            name: msg.t("DEPOSIT_USAGE"),
            value: msg.t("DEPOSIT_USAGE_DESC", prefix),
          },
        ],
        footer: {
          text: `${client.user.username} © Fishyrene`,
          icon_url: client.user.avatarURL,
        },
      };

      return msg.reply({ embed });
    }

    const [ subcommand, sum ] = args;

    if (subcommand != "put" && subcommand != "wd") return;

    let intSum = Math.floor(parseFloat(sum));
    if ((!intSum || intSum <= 0) && sum != "all") {
      return msg.reply(msg.t("DEPOSIT_INVALID_SUM"));
    }

    const userBal = await zetCoins.findOrCreate({ where: { user: msg.author.id } })
      .then(b => b[0]);
    const dep = await deposit.findOrCreate({ where: { user: msg.author.id } })
      .then(d => d[0]);

    if (subcommand == "put") {
      if (sum == "all") intSum = userBal.balance;

      if (intSum > userBal.balance) {
        return msg.reply(msg.t("DEPOSIT_NOT_ENOUGH_MONEY", userBal.balance));
      }

      await dep.update({ balance: dep.balance + intSum });
      await userBal.update({ balance: userBal.balance - intSum });

      const embed = {
        title: msg.t("DEPOSIT_PUT_SUCCESS"),
        color: await msg.author.embedColor(),
        fields: [
          {
            name: msg.t("DEPOSIT_YOUR_BALANCE"),
            value: msg.t("BALANCE_EMBED_DESCRIPTION", userBal.balance),
          },
          {
            name: msg.t("DEPOSIT_TOTAL"),
            value: msg.t("BALANCE_EMBED_DESCRIPTION", dep.balance),
          },
        ],
        footer: {
          text: `${client.user.username} © Fishyrene`,
          icon_url: client.user.avatarURL,
        },
      };

      await msg.reply({ embed });
    } else {
      if (sum == "all") intSum = dep.balance;
      
      if (intSum > dep.balance) {
        return msg.reply(msg.t("DEPOSIT_NOT_ENOUGH_DEPOSIT", dep.balance));
      }

      await dep.update({ balance: dep.balance - intSum });
      await userBal.update({ balance: userBal.balance + intSum });

      const embed = {
        title: msg.t("DEPOSIT_WD_SUCCESS"),
        color: await msg.author.embedColor(),
        fields: [
          {
            name: msg.t("DEPOSIT_YOUR_BALANCE"),
            value: msg.t("BALANCE_EMBED_DESCRIPTION", userBal.balance),
          },
          {
            name: msg.t("DEPOSIT_TOTAL"),
            value: msg.t("BALANCE_EMBED_DESCRIPTION", dep.balance),
          },
        ],
        footer: {
          text: `${client.user.username} © Fishyrene`,
          icon_url: client.user.avatarURL,
        },
      };

      await msg.reply({ embed });
    }
  }
}
