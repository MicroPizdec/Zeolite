module.exports = {
  name: "serverlang",
  group: "SETTINGS_GROUP",
  description: "SERVERLANG_DESCRIPTION",
  usage: "SERVERLANG_USAGE",
  requiredPermissions: "manageGuild",
  guildOnly: true,
  async run(client, msg, args, prefix, lang) {
    let language = args[0];
    let serverLang = await languages.findOrCreate({ where: { server: msg.guild.id } }).then(a => a[0]);

    if (!language) {
      let embed = {
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL,
        },
        title: _(lang, "LANG_AVAILABLE_LANGUAGES"),
        description: Object.keys(client.i18n.locales).join(", "),
        color: Math.round(Math.random() * 16777216),
        fields: [
          {
            name: _(lang, "SERVERLANG_LANGUAGE"),
            value: serverLang.language,
          },
        ],
        footer: { text: _(lang, "SERVERLANG_FOOTER", prefix) },
      };

      await msg.channel.createMessage({ embed });
    } else {
      if (!client.i18n.locales[language]) {
        return msg.channel.createMessage(_(lang, "LANG_NOT_EXIST"));
      }

      await serverLang.update({ language });

      await msg.channel.createMessage(_(lang, "SERVERLANG_SUCCESS", language));
    }
  }
}
