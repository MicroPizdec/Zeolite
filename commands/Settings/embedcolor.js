function intToHex(num) {
  let hex = num.toString(16);

  while (hex.length < 6) {
    hex = "0" + hex;
  }

  return hex;
}

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
        title: t(lang, "EMBEDCOLOR_YOUR_COLOR"),
        description: userColor.isRandom ? t(lang, "EMBEDCOLOR_RANDOM") : userColor.color ? `#${intToHex(userColor.color)}` : t(lang, "EMBEDCOLOR_DEFAULT"),
        color: await msg.author.embedColor(),
        footer: { text: t(lang, "EMBEDCOLOR_FOOTER", prefix) },
      };

      await msg.channel.createMessage({ embed });
    } else {
      switch (newColor) {
        case "default":
          await userColor.update({ color: null });
          return msg.channel.createMessage(t(lang, "EMBEDCOLOR_DEFAULT_SUCCESS"));
        case "random":
          await userColor.update({ color: null, isRandom: true });
          return msg.channel.createMessage(t(lang, "EMBEDCOLOR_RANDOM_SUCCESS"));
        default: {
          const colorNum = newColor.startsWith("#") ?
            parseInt(newColor.replace("#", ""), 16) :
            parseInt(newColor);
      
          if (isNaN(colorNum)) {
            return msg.channel.createMessage(t(lang, "EMBEDCOLOR_IS_NAN"));
          }

          if (colorNum > 16777216) {
            return msg.channel.createMessage(t(lang, "EMBEDCOLOR_TOO_BIG"));
          }

          await userColor.update({ color: colorNum, isRandom: false });
          await msg.channel.createMessage(t(lang, "EMBEDCOLOR_SUCCESS", intToHex(colorNum)));
        }
      }
    }
  }
}