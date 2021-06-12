module.exports = {
  name: "softban",
  group: "MODERATION_GROUP",
  description: "SOFTBAN_DESCRIPTION",
  usage: "KICK_USAGE",
  aliases: [ "sban", "clearban", "cban" ],
  requiredPermissions: "banMembers",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(msg.t("SOFTBAN_NO_ARGS", prefix));
    }

    const [ userID, ...reason ] = args;

    const member = msg.mentions.length ?
      msg.guild.members.get(msg.mentions[0].id) :
      msg.guild.members.find(m => m.tag == userID || m.id == userID);

    if (!member) {
      return msg.reply(msg.t("USER_NOT_FOUND"));
    }

    if (member.id === msg.author.id) {
      return msg.reply(msg.t("CANT_SOFTBAN_YOURSELF"));
    }
    if (member.id === client.user.id) {
      return msg.reply(msg.t("CANT_SOFTBAN_BOT"));
    }

    if (member.bannable && msg.member.highestRole.position > member.highestRole.position) {
      await member.ban(7, encodeURI(reason.join(" ")));
      await member.unban();

      const embed = {
        title: msg.t("SOFTBAN_SUCCESS", member.tag),
        description: msg.t("REASON", reason.join(" ")),
        color: 1638205,
      };

      await msg.reply({ embed });
    } else {
      let description;

      if (msg.member.highestRole.position <= member.highestRole.position) {
        description = msg.t("MEMBER_ROLE_HIGHER");
      } else if (msg.guild.me.highestRole.position <= member.highestRole.position) {
        description = msg.t("BOT_ROLE_HIGHER");
      } else if (msg.guild.me.permission.has("banMembers")) {
        description = msg.t("BAN_DONT_HAVE_PERMS");
      }

      const embed = {
        title: msg.t("SOFTBAN_FAILED"),
        description,
        color: 0xff1835,
      };

      await msg.reply({ embed });
    }
  }
}
