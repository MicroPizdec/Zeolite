const coin = [ "CFLIP_HEADS", "CFLIP_TAILS" ];

module.exports = {
  name: "cflip",
  group: "FUN_GROUP",
  description: "CFLIP_COMMAND_DESCRIPTION",
  async run(client, msg, args, prefix, language) {
    const sidewaysChance = Math.random() < 0.05;
    const coinSide = sidewaysChance ? "CFLIP_SIDEWAYS" : coin[Math.floor(Math.random() * 2)];

    const embed = {
      title: client.i18n.getTranslation(language, "CFLIP_EMBED_TITLE"),
      description: client.i18n.getTranslation(language, coinSide),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },  
    };
    await msg.channel.createMessage({ embed });
  }
}
