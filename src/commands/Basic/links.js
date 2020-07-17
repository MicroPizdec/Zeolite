module.exports = {
  name: "links",
  group: "BASIC_GROUP",
  description: "LINKS_COMMAND_DESCRIPTION",
  async run(client,msg, args, prefix, lang) {
    const embed = {
      title: _(lang, "LINKS_EMBED_TITLE"),
      description: _(lang, "LINKS_EMBED_DESCRIPTION"),
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
    };
    await msg.channel.createMessage({ embed });
  }
};
