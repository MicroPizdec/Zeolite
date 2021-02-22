module.exports = {
  name: "help",
  group: "BASIC_GROUP",
  description: "HELP_COMMAND_DESCRIPTION",
  usage: "HELP_COMMAND_USAGE",
  helpCommand: true,
  aliases: [ "h" ],
  async run(client, msg, args, prefix, lang) {
    const isDevHelp = client.owners.includes(msg.author.id) &&
      args[0] == "--dev" || args[0] == "-d";

    let embed = {
      fields: [],
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
  
    const cmdName = isDevHelp ? "" : args[0];
    
    if (!cmdName) {
      embed.title = t(lang, "HELP_EMBED_TITLE");
      embed.description = t(lang, "HELP_EMBED_DESC", prefix);

      if (isDevHelp)
        embed.title = t(lang, "HELP_EMBED_TITLE_OWNER_ONLY");

      for (const group of client.groups.values()) {
        let filterFunction = c => !c.hidden && !c.ownerOnly;
        if (isDevHelp) filterFunction = c => c.ownerOnly;

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

      if (!cmd || ((cmd.hidden || cmd.ownerOnly) && !client.owners.includes(msg.author.id))) {
        embed = {
          title: _(lang, "HELP_COMMAND_DOESNT_EXIST", cmdName, prefix),
          description: _(lang, "HELP_COMMAND_DOESNT_EXIST_DESC", prefix),
          color: 0xff1835,
          footer: {
            text: `${client.user.username} © ZariBros`,
            icon_url: client.user.avatarURL,
          }
        };

        return msg.channel.createMessage({ embed });
      }

      let usage = `${prefix}${cmd.name}`;
      if (cmd.usage) usage += ` ${_(lang, cmd.usage)}`;

      let description = _(lang, cmd.description)
      description = description[0].toUpperCase() + description.slice(1);
      description += ".";

      embed = {
        title: _(lang, "HELP_COMMAND_TITLE", cmd.name, prefix),
        description,
        color: await msg.author.embedColor(),
        fields: [
          {
            name: _(lang, "HELP_USAGE"),
            value: `\`\`\`${usage}\`\`\``,
          },
        ],
        footer: {
          text: `${client.user.username} © ZariBros`,
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
