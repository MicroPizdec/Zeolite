module.exports = {
  name: "respond",
  group: "DEV_GROUP",
  description: "RESPOND_DESCRIPTION",
  usage: "RESPOND_USAGE",
  ownerOnly: true,
  hidden: true,
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(_(lang, "RESPOND_NO_ARGS_PROMPT"));
    }

    let id = args[0];
    let answer = msg.content.slice(prefix.length + this.name.length + id.length + 2);

    let question = await support.findOne({ where: { id } });
    if (!question) {
      return msg.channel.createMessage(_(lang, "RESPOND_INVALID_ID"));
    }

    let { language: userLang } = await languages.findOne({ where: { server: msg.guild.id } });

    let embed = {
      title: t(lang, "RESPOND_SENT"),
      description: answer,
      fields: [
        {
          name: t(lang, "RESPOND_YOUR_QUESTION"),
          value: question.question,
        },
      ],
    };

    await client.createMessage(question.channel, { content: `<@${question.user}>`, embed });
    await msg.addReaction("✅");

    await question.destroy();
  }
}
