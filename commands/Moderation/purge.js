module.exports = {
  name: "purge",
  group: "MODERATION_GROUP",
  description: "PURGE_DESCRIPTION",
  usage: "PURGE_USAGE",
  guildOnly: true,
  requiredPermissions: "manageMessages",
  aliases: [ "prune", "clear" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(t(lang, "PURGE_NO_ARGS", prefix));
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount)) {
      return msg.channel.createMessage(t(lang, "AMOUNT_IS_NAN"));
    } else if (amount < 1) {
      return msg.channel.createMessage(t(lang, "PURGE_AMOUNT_LESS_THAN_1"));
    } else if (amount > 100) {
      return msg.channel.createMessage(t(lang, "PURGE_AMOUNT_MORE_THAN_100"));
    }

    await msg.channel.purge(amount + 1);

    const embed = {
      title: t(lang, "PURGE_SUCCESS", amount),
      description: t(lang, "PURGE_EMBED_DESC"),
      color: 1638205,
    };

    const message = await msg.channel.createMessage({ embed });
    setTimeout(() => message.delete().catch(() => {}), 5000);
  }
}
