const answers = {
  ru: [
    'Ничего не произойдет',
    'Это будет успехом.',
    'Будь осторожен.',
    'Это будет провалом.',
    ':candle: *тебе пиздец...*',
    'Ну нихуёво ты придумал.',
    'Я даже не знаю, как ответить.',
    'Проверь сам',
    'Давай!! ДАВАААЙ УРАА ДАВААЙ ДАААВААААЙ',
    'Не надо!! НЕ НАДО НЕЕЕЕТ НЕ НАААДО СТОЙ ХВАТИТ',
    'Ну давай твори псина',
    'Bruh',
    'Хуйня выйдет',
    'А хуй его знает.',
    'Ну давай ебашь',
    'Пёрни.',
    '<:lol:729690204759392266> Ачё идея норм)',
    'undefined',
    'Плохая идея.',
    'А я ебу чтоли?',
    '<:who:793130610968494090> Сомневаюсь что у тебя получится это сделать',
    '<:what:725632589205078031> Ебанёт интересно?',
    '<:sasavrBruh:802901813556543549> Зачем?',
  ],
  en: [
    'Nothing will happen',
    'It will be successful',
    'Be careful.',
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
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(_(lang, "WHATIF_NO_ARGS", prefix));
    }

    let question = msg.content.slice(prefix.length + this.name.length + 1);


    let embed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL,
      },
      description: _(lang, "WHATIF_EMBED_DESC", question),
      color: await msg.author.embedColor(),
      fields: [
        {
          name: _(lang, "WHATIF_ANSWER"),
          value: randomAnswer(lang),
        },
      ],
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };

    await msg.channel.createMessage({ embed });
  }
};

