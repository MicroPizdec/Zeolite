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
    "I would ask this question at the funeral <:roflanPominki:702906366452301874>",
    "What?!",
    "Very funny question 10/10 <:klass:680102836805435392>",
  ],
  ru: [
    "Да.",
    "Нет.",
    "Спроси меня об этом позже.",
    "Да или нет? То, что вы спрашиваете, это для меня сложный вопрос.",
    "Вероятнее всего нет.",
    "Естественно.",
    "Похоже, вы задаете слишком много вопросов.",
    "Возможно.",
    "Маловероятно.",
    "Сомневаюсь.",
    "¯\\_(ツ)\_/¯",
    "Я бы такой вопрос на похоронах задал <:roflanPominki:702906366452301874>",
    "Чего?!",
    "Очень смешной вопрос 10/10 <:klass:680102836805435392>",
    "Вот ты понимаешь? Это же настолько приprogrammistкий вопрос, супер пупер приprogrammistкий вопрос programmistа что меня аж заprogrammistить хотели <:bruh:708980706180726804>",
    "Полезная информация <:bruhsmile:711233520496017490>",
    "А в чём смеяться то? <:pokerface:709030841820643389>",
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
    if (!args.length)
      return msg.channel.createMessage(client.i18n.getTranslation(language, "_8BALL_NO_ARGS_PROMPT", prefix));

    if (msg.content.slice(prefix.length + this.name.length + 1).split(" ").length < 2) {
      return msg.channel.createMessage(_(language, "_8BALL_2_WORDS"));
    }

    const embed = {
      author: {
        name: msg.author.username + "#" + msg.author.discriminator,
        icon_url: msg.author.avatarURL,
      },
      title: client.i18n.getTranslation(language, "_8BALL_EMBED_TITLE", msg.content.slice(prefix.length + 1 + this.name.length)),
      description: randomArrayItem(answers[language]),
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
    };
    await msg.channel.createMessage({ embed });
  }
};
