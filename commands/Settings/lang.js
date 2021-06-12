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
        title: msg.t("LANG_AVAILABLE_LANGUAGES"),
        description: Array.from(client.languages.keys()).map(l => `\`${l}\``).join(", "),
        color: await msg.author.embedColor(),
        fields: [
          {
            name: msg.t("LANG_YOUR_LANGUAGE"),
            value: dbLang.overriden ? dbLang.language : msg.t("LANG_DEPENDING"),
          },
        ],
        footer: { text: msg.t("LANG_FOOTER", prefix) },
      };

      await msg.reply({ embed });
    } else {
      if (!client.languages.has(language)) {
        return msg.reply(msg.t("LANG_NOT_EXIST"));
      }

      await dbLang.update({ language, overriden: true });

      msg.author.lang = language;
      
      await msg.reply(msg.t("LANG_SUCCESS"));
    }
  }
}
