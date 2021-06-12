const intToHex = require("../../utils/intToHex");
const convert = require("color-convert");

module.exports = {
  name: "color",
  group: "OTHER_GROUP",
  description: "COLOR_DESCRIPTION",
  usage: "COLOR_USAGE",
  aliases: [ "c", "colorinfo" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    const colorStr = args[0];

    let colorNum = colorStr.startsWith("#") ?
      parseInt(colorStr.slice(1), 16) :
      parseInt(colorStr);
    
    if (colorStr == "-r" || colorStr == "--random") {
      colorNum = Math.round(Math.random() * 16777216);
    }
    
    if (isNaN(colorNum)) {
      return msg.reply(msg.t("EMBEDCOLOR_IS_NAN"));
    }

    if (colorNum > 0xffffff) {
      return msg.reply(msg.t("EMBEDCOLOR_TOO_BIG"));
    }

    const rgb = convert.hex.rgb(intToHex(colorNum));
    const hsl = convert.rgb.hsl(rgb);
    const cmyk = convert.rgb.cmyk(rgb);

    const embed = {
      title: `#${intToHex(colorNum)}`,
      color: colorNum,
      fields: [
        {
          name: "RGB",
          value: rgb.join(),
        },
        {
          name: "HSL",
          value: hsl.map(c => c == hsl[0] ? c : `${c}%`).join(),
          inline: true,
        },
        {
          name: "CMYK",
          value: cmyk.map(c => `${c}%`).join(),
          inline: true,
        },
        {
          name: msg.t("COLOR_NUMBER"),
          value: colorNum,
        },
      ],
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };

    await msg.reply({ embed });
  }
}