const PermissionError = require("../../core/errors/PermissionError");

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
        description: msg.t("PREFIX_DESC", prefix),
        color: await msg.author.embedColor(),
      };

      if (msg.member.permission.has("manageGuild")) {
        embed.footer = { 
          text: msg.t("PREFIX_FOOTER", prefix),
          icon_url: msg.author.avatarURL,
        };
      }

      await msg.reply({ embed });
    } else {
      if (!msg.member.permission.has("manageGuild")) {
        throw new PermissionError("", "manageGuild");
      }

      if (prefixArg.length > 10) {
        return msg.reply(msg.t("PREFIX_TOO_LONG"));
      }

      const guildPrefix = await prefixes.findOrCreate({ where: { server: msg.guild.id } })
        .then(i => i[0]);
      await guildPrefix.update({ prefix: prefixArg.toLowerCase() });

      await msg.reply(msg.t("PREFIX_SUCCESS", guildPrefix.prefix));
    }
  }
}
