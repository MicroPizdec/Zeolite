module.exports = {
  name: "lang",
  group: "SETTINGS_GROUP",
  description: "LANG_DESCRIPTION",
  usage: "LANG_USAGE",
  async run(client, msg, args, prefix, lang) {
    let language = args[0];
    let dbLang = await userLanguages.findOrCreate({ where: { user: msg.author.id } })
      .then(l => l[0]);

    if (!language) {
      let embed = {
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL,
        },
        title: _(lang, "LANG_AVAILABLE_LANGUAGES"),
        description: Object.keys(client.i18n.locales).join(", "),
        color: await msg.author.embedColor(),
        fields: [
          {
            name: _(lang, "LANG_YOUR_LANGUAGE"),
            value: dbLang.overriden ? dbLang.language : _(lang, "LANG_DEPENDING"),
          },
        ],
        footer: { text: _(lang, "LANG_FOOTER", prefix) },
      };

      await msg.channel.createMessage({ embed });
    } else {
      if (!client.i18n.locales[language]) {
        return msg.channel.createMessage(_(lang, "LANG_NOT_EXIST"));
      }

      await dbLang.update({ language, overriden: true });

      await msg.channel.createMessage(_(language, "LANG_SUCCESS"));
    }
  }
}
