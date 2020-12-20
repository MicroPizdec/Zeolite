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
    const userColor = await embColors.findOne({ where: { user: msg.author.id } });

    const newColor = args[0];
    if (!newColor) {
      const embed = {
        
      }
    }
  }
}