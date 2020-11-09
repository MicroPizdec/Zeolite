const PermissionError = require("../../core/errors/permissionError");

module.exports = {
  name: "prefix",
  group: "SETTINGS_GROUP",
  description: "PREFIX_DESCRIPTION",
  usage: "PREFIX_USAGE",
  async run(client, msg, args, prefix, lang) {
    const prefixArg = args[0];
    if (!prefixArg) {
      const embed = {
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL,
        },
        description: t(lang, "PREFIX_DESC", prefix),
        color: Math.round(Math.random() * 16777216),
      };

      if (msg.member.permission.has("manageGuild")) {
        embed.footer = { 
          text: t(lang, "PREFIX_FOOTER", prefix),
          icon_url: msg.author.avatarURL,
        };
      }

      await msg.channel.createMessage({ embed });
    } else {
      if (!msg.member.permission.has("manageGuild")) {
        throw new PermissionError("", "manageGuild");
      }

      if (prefixArg.length > 10) {
        return msg.channel.createMessage(t(lang, "PREFIX_TOO_LONG"));
      }

      const guildPrefix = await prefixes.findOrCreate({ where: { server: msg.guild.id } })
        .then(i => i[0]);
      await guildPrefix.update({ prefix: prefixArg.toLowerCase() });

      await msg.channel.createMessage(t(lang, "PREFIX_SUCCESS", guildPrefix.prefix));
    }
  }
}
