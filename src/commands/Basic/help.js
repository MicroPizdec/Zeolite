module.exports = {
  name: "help",
  group: "BASIC_GROUP",
  description: "HELP_COMMAND_DESCRIPTION",
  helpCommand: true,
  async run(client, msg, args, prefix, language) {
    let embed = {
      title: client.i18n.getTranslation(language, "HELP_EMBED_TITLE"),
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [],
      footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
    };

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
      embed.fields.push({
        name: client.i18n.getTranslation(language, group.name),
        value: commandList,
      });
    }

    await msg.channel.createMessage({ embed });
  }
};
