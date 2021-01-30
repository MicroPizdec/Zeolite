function randInt(max, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "random",
  group: "OTHER_GROUP",
  description: "RANDOM_DESCRIPTION",
  usage: "RANDOM_USAGE",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(t(lang, "RANDOM_NO_ARGS", prefix));
    }

    let [ min, max ] = args;
    if (!max) {
      max = min;
      min = 1;
    }

    max = parseInt(max);
    min = parseInt(min);

    if (isNaN(max) || isNaN(min)) {
      return msg.channel.createMessage(t(lang, "RANDOM_NUMBER_IS_NAN"));
    }

    const num = randInt(max, min);

    const embed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL,
      },
      title: t(lang, "RANDOM_TITLE", max, min),
      description: num,
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };

    await msg.channel.createMessage({ embed });
  }
}