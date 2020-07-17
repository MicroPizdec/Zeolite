const answers = {
  ru: [
    'Всё будет нормально, только бегом на Avito за турбиной дружок пирожок, готовь утюшок!',
    'Это будет успехом!',
    'Хм... впринципе можно попробовать только без пятого не начинай.',
    'Это может вызвать сердечный приступ так что лучше не надо...',
    'блять у меня чет с башки слетело попробуй позже.',
    'С помощью KCAS на 1000 ват. не забудь это сделать',
  ],
  en: [
    'Everything will be okay, but go to Avito for turbine and prepare your iron, friend!',
    'It will be successful!',
    'Hmm... you can try it, but don\'t start without fifth.',
    'Don\'t do it, because it may cause heart attack.',
    'oh fuck, something flew off my head, try again later.',
    'Don\'t forget to do it with 1000 watt KCAS.'
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
