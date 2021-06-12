const intToHex = require("../../utils/intToHex");

module.exports = {
  name: "embedcolor",
  group: "SETTINGS_GROUP",
  description: "EMBEDCOLOR_DESCRIPTION",
  usage: "EMBEDCOLOR_USAGE",
  aliases: [ "embcolor", "embc" ],
  async run(client, msg, args, prefix, lang) {
    const userColor = await embColors.findOrCreate({ where: { user: msg.author.id } })
      .then(c => c[0]);

    const newColor = args[0];
    if (!newColor) {
      const embed = {
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL,
        },
        title: msg.t("EMBEDCOLOR_YOUR_COLOR"),
        description: userColor.isRandom ? msg.t("EMBEDCOLOR_RANDOM") : userColor.color ? `#${intToHex(userColor.color)}` : msg.t("EMBEDCOLOR_DEFAULT"),
        color: await msg.author.embedColor(),
        footer: { text: msg.t("EMBEDCOLOR_FOOTER", prefix) },
      };

      await msg.reply({ embed });
    } else {
      switch (newColor) {
        case "default":
          await userColor.update({ color: null, isRandom: false });
          return msg.reply(msg.t("EMBEDCOLOR_DEFAULT_SUCCESS"));
        case "random":
          await userColor.update({ color: null, isRandom: true });
          return msg.reply(msg.t("EMBEDCOLOR_RANDOM_SUCCESS"));
        default: {
          const colorNum = newColor.startsWith("#") ?
            parseInt(newColor.replace("#", ""), 16) :
            parseInt(newColor);
      
          if (isNaN(colorNum)) {
            return msg.reply(msg.t("EMBEDCOLOR_IS_NAN"));
          }

          if (colorNum > 16777216) {
            return msg.reply(msg.t("EMBEDCOLOR_TOO_BIG"));
          }

          await userColor.update({ color: colorNum, isRandom: false });
          await msg.reply(msg.t("EMBEDCOLOR_SUCCESS", intToHex(colorNum)));
        }
      }
    }
  }
}