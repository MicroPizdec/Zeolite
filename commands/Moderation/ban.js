module.exports = {
  name: "ban",
  group: "MODERATION_GROUP",
  description: "BAN_DESCRIPTION",
  usage: "KICK_USAGE",
  requiredPermissions: "banMembers",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(t(lang, "BAN_NO_ARGS", prefix));
    }
    const [ userID, ...reason ] = args;

    const member = msg.mentions.length ?
      msg.guild.members.get(msg.mentions[0].id) :
      msg.guild.members.find(m => m.tag == userID || m.id == userID);

    if (!member) {
      return msg.reply(t(lang, "USER_NOT_FOUND"));
    }

    if (member.id === msg.author.id) {
      return msg.reply(t(lang, "CANT_BAN_YOURSELF"));
    } else if (member.id === client.user.id) {
      return msg.reply(t(lang, "CANT_BAN_BOT"));
    }

    if (member.bannable && msg.member.highestRole.position > member.highestRole.position) {
      await member.ban(0, encodeURI(`${reason.join(" ")} (banned by: ${msg.author.tag})`));

      const embed = {
        title: t(lang, "BAN_SUCCESS", member.tag),
        description: t(lang, "REASON", reason.join(" ")),
        color: 0x18ff3d,
      };

      await msg.reply({ embed });
    } else {
      let description;
      if (msg.member.highestRole.position <= member.highestRole.position) {
        description = t(lang, "MEMBER_ROLE_HIGHER");
      } else if (member.highestRole.position >= msg.guild.me.highestRole.position) {
        description = t(lang, "BOT_ROLE_HIGHER");
      } else if (msg.guild.me.permission.has("kickMembers")) {
        description = t(lang, "BAN_DONT_HAVE_PERMS");
      }

      const embed = {
        title: t(lang, "BAN_FAILED"),
        description,
        color: 0xff1835,
      };

      await msg.reply({ embed });
    }
  }
}
