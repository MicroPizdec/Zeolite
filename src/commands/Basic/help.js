const ReactionHandler = require("eris-reactions");

module.exports = {
  name: "help",
  group: "BASIC_GROUP",
  description: "HELP_COMMAND_DESCRIPTION",
  usage: "HELP_COMMAND_USAGE",
  helpCommand: true,
  aliases: [ "h" ],
  async run(client, msg, args, prefix, lang) {
    let embed = {
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: "Zeolite © 2019-2020 ZariBros",
        icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
      },
    };

    const cmdName = args[0];
    
    if (!cmdName) {
      let pages = [];

      if (prefix == client.prefix2)
        embed.title = client.i18n.getTranslation(lang, "HELP_EMBED_TITLE_OWNER_ONLY");

      for (const group of client.groups.values()) {
        let filterFunction = c => !c.ownerOnly;
        if (prefix == client.prefix2) filterFunction = c => c.ownerOnly;
        const commandList = group.commands.filter(filterFunction).map(c => {
          let usage = `\`${prefix}${c.name}`;
          if (c.usage) usage += ` ${client.i18n.getTranslation(lang, c.usage)}\``;
          else usage += "`";

          return `${usage} - ${client.i18n.getTranslation(lang, c.description)}`;
        }).join("\n");
        if (!commandList.length) continue;
        pages.push({
          name: client.i18n.getTranslation(lang, group.name),
          value: commandList,
        });
      }

      let pageNumber = 0;
      embed.fields = [ pages[0] ];

      embed.title = _(lang, "HELP_EMBED_TITLE", pageNumber + 1, pages.length);

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

        embed.title = _(lang, "HELP_EMBED_TITLE", pageNumber + 1, pages.length);
        embed.fields = [ pages[pageNumber] ];
        await message.edit({ embed });
        await message.removeReaction(event.emoji.name, msg.author.id);
      });
    } else {
      const cmd = client.commands.find(c => c.name === cmdName || (c.aliases && c.aliases.includes(cmdName)));

      if (!cmd || (cmd.ownerOnly && !client.owners.includes(msg.author.id))) {
        embed = {
          title: _(lang, "HELP_COMMAND_DOESNT_EXIST", cmdName, prefix),
          description: _(lang, "HELP_COMMAND_DOESNT_EXIST_DESC", prefix),
          color: 0xff1835,
          footer: {
            text: "Zeolite © 2019-2020 ZariBros",
            icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
          }
        };

        return msg.channel.createMessage({ embed });
      }

      let usage = `${cmd.ownerOnly ? client.prefix2 : client.prefix1}${cmd.name}`;
      if (cmd.usage) usage += ` ${_(lang, cmd.usage)}`;

      let description = _(lang, cmd.description)
      description = description[0].toUpperCase() + description.slice(1);
      description += ".";

      embed = {
        title: _(lang, "HELP_COMMAND_TITLE", cmd.name, cmd.ownerOnly ? client.prefix2 : client.prefix1),
        description,
        color: Math.round(Math.random() * 16777216),
        fields: [
          {
            name: _(lang, "HELP_USAGE"),
            value: `\`\`\`${usage}\`\`\``,
          },
        ],
        footer: {
          text: "Zeolite © 2019-2020 ZariBros",
          icon_url: "https://yt3.ggpht.com/a-/AAuE7mC54pDFKe5kqwhrrNUNdwOABF0ogi8Yw4S5NZaeQQ=s288-c-k-c0xffffffff-no-rj-mo",
        }
      };

      if (cmd.aliases) {
        embed.fields.push({
          name: _(lang, "HELP_ALIASES"),
          value: cmd.aliases.map(a => `\`${a}\``).join(", "),
        })
      }

      await msg.channel.createMessage({ embed });
    }
  }
};
