function randomArrayItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const answers = {
  en: [
    "Yes",
    "No",
    "Ask me about it later.",
    "Yes or no? What you ask is a difficult question for me.",
    "Most likely not.",
    "Naturally.",
    "Looks like you are asking too many questions",
    "Maybe.",
    "Unlikely.",
    "I doubt it.",
    "¯\\_(ツ)\_/¯",
    "Maybe",
    "What?",
    "I don't answer to this questions",
  ],
  ru: [
    "Да.",
    "Нет.",
    "Спроси меня об этом позже.",
    "Да или нет? То, что вы спрашиваете, это для меня сложный вопрос.",
    "Скорее всего нет",
    "Естественно.",
    "Похоже, вы задаете слишком много вопросов.",
    "Возможно.",
    "Маловероятно.",
    "Сомневаюсь.",
    "¯\\_(ツ)\_/¯",
    "Давай что-нибудь другое, я затрудняюсь ответить",
    "Каво?",
    "Чё?",
    "Наверное",
    "Не-а",
    "На этот вопрос мне бессмысленно отвечать",
    "Я на такие вопросы не отвечаю"
    "Чё он сказал??? Я один хочу его уебать???",
    "Очень хороший и добрый вопрос! =)\nАвтору вопроса цистерну чая и вагон конфет =)",
    "Охуеть спс бро я же блять банан ебаный и сам не догадался",
    "Нихуя садись 2",
    "БЛЯЯЯЯ\nКАК ЖЕ ТВОЯ МАТЬ МНЕ ВЧЕРА ХУЙ ВКУСНО ОТСОСАЛА",
    "Ахуеть я терминал",
    "Ты еблан ты еблан соси хуй еблан",
  ],
  ua: [
    "Так.",
    "Немає.",
    "Запитай мене про це пізніше",
    "Так чи ні? Те що ви питаєте це для мене складне питання.",
    "Найімовірніше немає.",
    "Природно.",
    "Схоже ви задаєте занадто багато питань.",
    "Можливо.",
    "Це малоймовірно",
    "Сумніваюся.",
    "¯\_(ツ)_/¯",
  ],
};

module.exports = {
  name: "8ball",
  group: "FUN_GROUP",
  description: "_8BALL_COMMAND_DESCRIPTION",
  usage: "_8BALL_COMMAND_USAGE",
  async run(client, msg, args, prefix, language) {
    if (!args.length) {
      return msg.channel.createMessage(t(language, "_8BALL_NO_ARGS_PROMPT", prefix));
    }

    const question = args.raw.join(" ");

    const embed = {
      author: {
        name: msg.author.username + "#" + msg.author.discriminator,
        icon_url: msg.author.avatarURL,
      },
      title: t(language, "_8BALL_EMBED_TITLE"),
      description: randomArrayItem(answers[language]),
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [
        {
        name: t(language, "_8BALL_YOUR_QUESTION"),
        value: question,
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
