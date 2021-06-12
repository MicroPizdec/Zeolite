const coin = [ "CFLIP_HEADS", "CFLIP_TAILS" ];

module.exports = {
  name: "cflip",
  group: "FUN_GROUP",
  description: "CFLIP_COMMAND_DESCRIPTION",
  aliases: [ "coinflip" ],
  async run(client, msg, args, prefix, language) {
    const sidewaysChance = Math.random() < 0.05;
    const coinSide = sidewaysChance ? "CFLIP_SIDEWAYS" : coin[Math.floor(Math.random() * 2)];

    const embed = {
      title: msg.t("CFLIP_EMBED_TITLE"),
      description: msg.t(coinSide),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },  
    };
    await msg.reply({ embed });
  }
}
