module.exports = {
    name: "who",
    group: "FUN_GROUP",
    description: "WHOIS_DESCRIPTION",
    usage: "WHOIS_USAGE",
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
    const randomUser = msg.channel.guild.members.random().user.username;
    const subject = msg.content.slice(prefix.length + this.name.length + 1); 
    const answers = {
        ru: [
          `${randomUser}`,
          `Попрыгунчик ${randomUser} нашёлся.`,
          `Мне кажется, что это ${randomUser}.`,
          `Мне подсказывает моя интуиция, что это ${randomUser}.`,
          `${randomUser}, не ты ли?`,
          `${randomUser}, не ты ли ${subject}?`,
          `${randomUser} ${subject}!`,
          `${randomUser} ${subject}.`,
          
        ],
        en: [
          `${randomUser}`,
          `Maybe is ${randomUser}.`,
          `My intuition tells me, is ${randomUser}.`,
          `${randomUser} is ${subject}.`,
          `${randomUser} is ${subject}!`,
          `${randomUser}, aren't you?`,
        ],
      };
      
      function randomAnswer(lang) {
        let langAnswers = answers[lang];
        return langAnswers[Math.floor(Math.random() * langAnswers.length)];
      }
  
    let embed = {
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL,
        },
        description: t(lang, "WHOIS_EMBED_DESC", subject),
        color: await msg.author.embedColor(),
        fields: [
          {
            name: t(lang, "WHOIS_ANSWER"),
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