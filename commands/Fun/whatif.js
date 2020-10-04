const answers = {
  ru: [
    'Ничего не произойдет',
    'Это будет успехом!',
    'Хм... впринципе можно попробовать только без пятого не начинай.',
    'Это может вызвать сердечный приступ так что лучше не надо...',
    'Я даже не знаю, как ответить.',
    'Плохая идея',
  ],
  en: [
    'Nothing will happen',
    'It will be successful!',
    'Hmm... you can try it, but don\'t start without fifth.',
    'Don\'t do it, because it may cause heart attack.',
    'I don\'t know what to answer.',
    'It\'s a bad idea.'
  ],
};

function randomAnswer(lang) {
  let langAnswers = answers[lang];
  return langAnswers[Math.floor(Math.random() * langAnswers.length)];
}

module.exports = {
  name: "whatif",
  group: "FUN_GROUP",
  description: "WHATIF_DESCRIPTION",
  usage: "WHATIF_USAGE",
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(_(lang, "WHATIF_NO_ARGS", prefix));
    }

    let question = msg.content.slice(prefix.length + this.name.length + 1);

    if (question.split(" ").length < 2) {
      return msg.channel.createMessage(_(lang, "WHATIF_2_WORDS"));
    }

    let embed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL,
      },
      title: _(lang, "WHATIF_EMBED_TITLE"),
      description: _(lang, "WHATIF_EMBED_DESC", question),
      color: Math.round(Math.random() * 16777216),
      fields: [
        {
          name: _(lang, "WHATIF_ANSWER"),
          value: randomAnswer(lang),
        },
      ],
      footer: { text: _(lang, "WHATIF_FOOTER") },
    };

    await msg.channel.createMessage({ embed });
  }
};
