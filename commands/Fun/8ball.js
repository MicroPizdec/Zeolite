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
    "Looks like you are asking too many questions.",
    "Maybe.",
    "Unlikely.",
    "I doubt it.",
    "¯\\_(ツ)\_/¯",
    "Maybe.",
    "What?",
    "I don't answer to these questions.",
  ],
  ru: [
    "Да.",
    "Нет.",
    "Спроси меня об этом позже.",
    "Да или нет? То, что вы спрашиваете, это для меня сложный вопрос.",
    "Скорее всего нет.",
    "Естественно.",
    "Похоже, вы задаете слишком много вопросов.",
    "Возможно.",
    "Маловероятно.",
    "Сомневаюсь.",
    "¯\\_(ツ)\_/¯",
    "Давай что-нибудь другое, я затрудняюсь ответить.",
    "Каво?",
    "Чё?",
    "Наверное.",
    "Не-а.",
    "На этот вопрос мне бессмысленно отвечать.",
    "Я на такие вопросы не отвечаю.",
    "Чё он сказал??? Я один хочу его уебать???",
    "А что, звучит хайпово.",
    "Охуеть спс бро я же блять банан ебаный и сам не догадался.",
    "Нихуя садись 2.",
    "БЛЯЯЯЯ\nКАК ЖЕ ТВОЯ МАТЬ МНЕ ВЧЕРА ХУЙ ВКУСНО ОТСОСАЛА.",
    "Ахуеть я терминал.",
    "Ты еблан ты еблан соси хуй еблан.",
    "абалдеть блять.",
    "Охуеть.",
    "Всем интересно!",
    "Всем похуй!",
    "Ладно.",
    "Нет слов - одни эмоции.",
    "Зачем?",
    "А смысл?",
    "Нахуя?",
    "<:sasavrBruh:802901813556543549> Попрыгунчик нашёлся.",
    "Ты на меня буквы не повышай, мой хороший!",
    "ЯЗЫК БЛЯТЬ ПОЛОМАЕШ В ТРЁХ МЕСТАХ БЛЯТЬ.",
    "Ручонки отпустил что-ли, а? Сынок ёбаный! Мальчиш - ебальчиш нахуй.",
    "К чему это?",
    "Чепушило ебаное, упал на колени живо ёпта.",
    "Чел.",
    "Нефига себя.",
    "смешно. смеёмся",
    "Класс ты гений.",
    "Ахахахаха.",
  ],
 /* ua: [
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
  ], */
};

module.exports = {
  name: "8ball",
  group: "FUN_GROUP",
  description: "_8BALL_COMMAND_DESCRIPTION",
  usage: "_8BALL_COMMAND_USAGE",
  aliases: [ "8b" ],
  argsRequired: true,
  async run(client, msg, args, prefix, language) {
    if (!args.length) {
      return msg.reply(msg.t("_8BALL_NO_ARGS_PROMPT", prefix));
    }

    const question = args.raw.join(" ");

    const embed = {
      author: {
        name: msg.author.username + "#" + msg.author.discriminator,
        icon_url: msg.author.avatarURL,
      },
      title: msg.t("_8BALL_EMBED_TITLE"),
      description: randomArrayItem(answers[language]),
      color: await msg.author.embedColor(),
      fields: [
        {
        name: msg.t("_8BALL_YOUR_QUESTION"),
        value: question,
        },
      ],
      footer: {
        text: `${client.user.username} © Fishyrene`,
        icon_url: client.user.avatarURL,
      },
    };

    await msg.reply({ embed });
  }
};
