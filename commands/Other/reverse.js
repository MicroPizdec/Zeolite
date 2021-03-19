module.exports = {
  name: "reverse",
  group: "OTHER_GROUP",
  description: "REVERSE_DESCRIPTION",
  usage: "REVERSE_USAGE",
  aliases: [ "rev" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.raw.length) {
      return msg.reply(t(lang, "REVERSE_NO_ARGS", prefix));
    }

    const reversedString = args.raw.join(" ").split("").reverse().join("");

    const embed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL,
      },
      title: t(lang, "REVERSE_TITLE"),
      description: reversedString,
      color: await msg.author.embedColor(),
    }

    await msg.reply({ embed });
  }
};
