module.exports = {
  name: "help",
  group: "BASIC_GROUP",
  description: "HELP_COMMAND_DESCRIPTION",
  usage: "HELP_COMMAND_USAGE",
  helpCommand: true,
  aliases: [ "h" ],
  async run(client, msg, args, prefix, lang) {
    let embed = {
      fields: [],
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: `${client.user.username} © 2019-2020 ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };

    const cmdName = args[0];
    
    if (!cmdName) {
      embed.title = t(lang, "HELP_EMBED_TITLE");
      embed.description = t(lang, "HELP_EMBED_DESC", prefix);

      if (prefix == client.prefix2)
        embed.title = client.i18n.getTranslation(lang, "HELP_EMBED_TITLE_OWNER_ONLY");

      for (const group of client.groups.values()) {
        let filterFunction = c => !c.ownerOnly;
        if (prefix == client.prefix2) filterFunction = c => c.ownerOnly;

        const cmdList = group.commands.filter(filterFunction)
          .map(c => `\`${c.name}\``).join(", ");
        if (!cmdList) continue;

        embed.fields.push({
          name: t(lang, group.name),
          value: cmdList,
        });
      }

      const message = await msg.channel.createMessage({ embed });
    } else {
      const cmd = client.commands.find(c => c.name === cmdName || (c.aliases && c.aliases.includes(cmdName)));

      if (!cmd || (cmd.ownerOnly && !client.owners.includes(msg.author.id))) {
        embed = {
          title: _(lang, "HELP_COMMAND_DOESNT_EXIST", cmdName, prefix),
          description: _(lang, "HELP_COMMAND_DOESNT_EXIST_DESC", prefix),
          color: 0xff1835,
          footer: {
            text: `${client.user.username} © 2019-2020 ZariBros`,
            icon_url: client.user.avatarURL,
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
          text: `${client.user.username} © 2019-2020 ZariBros`,
          icon_url: client.user.avatarURL,
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
