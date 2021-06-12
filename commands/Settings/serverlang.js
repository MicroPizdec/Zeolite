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
        title: msg.t("LANG_AVAILABLE_LANGUAGES"),
        description: Object.keys(client.i18n.locales).join(", "),
        color: await msg.author.embedColor(),
        fields: [
          {
            name: msg.t("SERVERLANG_LANGUAGE"),
            value: serverLang.language,
          },
        ],
        footer: { text: msg.t("SERVERLANG_FOOTER", prefix) },
      };

      await msg.reply({ embed });
    } else {
      if (!client.i18n.locales[language]) {
        return msg.reply(msg.t("LANG_NOT_EXIST"));
      }

      await serverLang.update({ language });

      await msg.reply(msg.t("SERVERLANG_SUCCESS", language));
    }
  }
}
