const ReactionHandler = require("eris-reactions");

module.exports = {
  name: "help",
  group: "BASIC_GROUP",
  description: "HELP_COMMAND_DESCRIPTION",
  helpCommand: true,
  async run(client, msg, args, prefix, language) {
    let embed = {
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
    };

    let pages = [];

    if (prefix == client.prefix2)
      embed.title = client.i18n.getTranslation(language, "HELP_EMBED_TITLE_OWNER_ONLY");

    for (const group of client.groups.values()) {
      let filterFunction = c => !c.ownerOnly;
      if (prefix == client.prefix2) filterFunction = c => c.ownerOnly;
      const commandList = group.commands.filter(filterFunction).map(c => {
        let usage = `\`${prefix}${c.name}`;
        if (c.usage) usage += ` ${client.i18n.getTranslation(language, c.usage)}\``;
        else usage += "`";

        return `${usage} - ${client.i18n.getTranslation(language, c.description)}`;
      }).join("\n");
      if (!commandList.length) continue;
      pages.push({
        name: client.i18n.getTranslation(language, group.name),
        value: commandList,
      });
    }

    let pageNumber = 0;
    embed.fields = [ pages[0] ];

    embed.title = _(language, "HELP_EMBED_TITLE", pageNumber + 1, pages.length);

    const message = await msg.channel.createMessage({ embed });
    await message.addReaction("◀");
    await message.addReaction("▶");
    // await message.addReaction("❌");

    const reactionListener = new ReactionHandler.continuousReactionStream(
      message,
      (id) => id === msg.author.id,
      false,
      { maxMatches: 100, time: 3600000 },
    );

    reactionListener.on("reacted", async event => {
      switch (event.emoji.name) {
        case "◀":
          if (pageNumber === 0) return;
          pageNumber--;
          break;
        case "▶":
          if (pageNumber === (pages.length - 1)) return;
          pageNumber++;
          break;
        default: return;
      }

      embed.title = _(language, "HELP_EMBED_TITLE", pageNumber + 1, pages.length);
      embed.fields = [ pages[pageNumber] ];
      await message.edit({ embed });
      await message.removeReaction(event.emoji.name, msg.author.id);
    });
  }
};
