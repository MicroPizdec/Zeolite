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
            color: Math.round(Math.random() * 16777216) + 1,
            footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
        };
        await msg.channel.createMessage({ embed });
    }
}
