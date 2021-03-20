const PermissionError = require("../../core/errors/permissionError");

module.exports = {
  name: "warn",
  group: "MODERATION_GROUP",
  description: "WARN_DESCRIPTION",
  usage: "WARN_USAGE",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(t(lang, "WARN_NO_ARGS", prefix));
    }

    const userID = args.shift();

    if (userID == "-l") {
      let user;
      if (args[0]) {
        user = msg.mentions.length ? msg.guild.members.get(msg.mentions[0].id)
          : msg.guild.members.find(m => m.id == args[0] || m.tag == args[0]);
      } else {
        user = msg.member;
      }

      if (!user) {
        return msg.reply(t(lang, "USER_NOT_FOUND"));
      }

      const warnlist = await warns.findAll({ where: { user: user.id, server: msg.guild.id } });

      const embed = {
        author: {
          name: user.tag,
          icon_url: user.avatarURL,
        },
        title: t(lang, "WARN_LIST"),
        color: await msg.author.embedColor(),
        fields: [],
        footer: { text: t(lang, "WARN_TOTAL", warnlist.length) },
      };

      for (const warn of warnlist) {
        embed.fields.push({
          name: t(lang, "WARN_ITEM", warn.id, await client.fetchUser(warn.warnedBy)),
          value: t(lang, "REASON", warn.reason),
        });
      }

      await msg.reply({ embed });
    } else if (userID == "-d") {
      if (!msg.member.permissions.has("kickMembers")) {
        throw new PermissionError("", "kickMembers");
      }

      if (!args[0]) {
        return msg.reply(t(lang, "WARN_DELETE_NO_ID"));
      }

      const warn = await warns.findOne({ where: { id: args[0] } });

      if (!warn || warn.server != msg.guild.id) {
        return msg.reply(t(lang, "WARN_INVALID_ID"));
      }

      await warn.destroy();

      await msg.reply(t(lang, "WARN_DELETE_SUCCESS", args[0]));
    } else {
      if (!msg.member.permissions.has("kickMembers")) {
        throw new PermissionError("", "kickMembers");
      }

      const user = msg.mentions.length ? msg.guild.members.get(msg.mentions[0].id)
      : msg.guild.members.find(m => m.id == userID || m.tag == userID);

      if (!user) {
        return msg.reply(t(lang, "USER_NOT_FOUND")); 
      }

      if (user.id == msg.author.id) {
        return msg.reply(t(lang, "CANT_WARN_YOURSELF"));
      }
      if (user.bot) {
        return msg.reply(t(lang, "CANT_WARN_BOTS"));
      }

      const reason = args.join(" ");
      if (reason.length > 100) {
        return msg.reply(t(lang, "WARN_REASON_TOO_LONG"));
      }

      if (user.punishable(msg.member)) {
        const warn = await warns.create({
          server: msg.guild.id,
          user: user.id,
          warnedBy: msg.author.id,
          reason,
        });

        const embed = {
          title: t(lang, "WARN_SUCCESS", user.tag),
          description: t(lang, "REASON", reason),
          color: 0x18ff3d,
          footer: { text: t(lang, "WARN_ID", warn.id) },
        };

        await msg.reply({ embed });
      } else {
        const embed = {
          title: t(lang, "WARN_FAILED"),
          description: t(lang, "WARN_FAILED_REASON"),
          color: 16717877,
        };

        await msg.reply({ embed });
      }
    }
  }
}