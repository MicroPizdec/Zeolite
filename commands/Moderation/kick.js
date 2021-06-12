module.exports = {
  name: "kick",
  group: "MODERATION_GROUP",
  description: "KICK_DESCRIPTION",
  usage: "KICK_USAGE",
  requiredPermissions: "kickMembers",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(msg.t("KICK_NO_ARGS", prefix));
    }
    const [ userID, ...reason ] = args;

    const member = msg.mentions.length ?
      msg.guild.members.get(msg.mentions[0].id) :
      msg.guild.members.find(m => m.tag == userID || m.id == userID);

    if (!member) {
      return msg.reply(msg.t("USER_NOT_FOUND"));
    }

    if (member.id === msg.author.id) {
      return msg.reply(msg.t("CANT_KICK_YOURSELF"));
    } else if (member.id === client.user.id) {
      return msg.reply(msg.t("CANT_KICK_BOT"));
    }

    if (member.kickable && msg.member.highestRole.position > member.highestRole.position) {
      await member.kick(encodeURI(`${reason.join(" ")} (kicked by: ${msg.author.tag})`));

      const embed = {
        title: msg.t("KICK_SUCCESS", member.tag),
        description: msg.t("REASON", reason.join(" ")),
        color: 0x18ff3d,
      };

      await msg.reply({ embed });
    } else {
      let description;
      if (msg.member.highestRole.position <= member.highestRole.position) {
        description = msg.t("MEMBER_ROLE_HIGHER");
      } else if (member.highestRole.position >= msg.guild.me.highestRole.position) {
        description = msg.t("BOT_ROLE_HIGHER");
      } else if (msg.guild.me.permission.has("kickMembers")) {
        description = msg.t("KICK_DONT_HAVE_PERMS");
      }

      const embed = {
        title: msg.t("KICK_FAILED"),
        description,
        color: 0xff1835,
      };

      await msg.reply({ embed });
    }
  }
}
