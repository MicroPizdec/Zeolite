module.exports = {
  name: "kick",
  group: "MODERATION_GROUP",
  description: "KICK_DESCRIPTION",
  usage: "KICK_USAGE",
  requiredPermissions: "kickMembers",
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(t(lang, "KICK_NO_ARGS", prefix));
    }
    const [ userID, ...reason ] = args;

    const member = msg.mentions.length ?
      msg.guild.members.get(msg.mentions[0].id) :
      msg.guild.members.find(m => m.tag == userID || m.id == userID);

    if (!member) {
      return msg.channel.createMessage(t(lang, "USER_NOT_FOUND"));
    }

    if (member.id === msg.author.id) {
      return msg.channel.createMessage(t(lang, "CANT_KICK_YOURSELF"));
    } else if (member.id === client.user.id) {
      return msg.channel.createMessage(t(lang, "CANT_KICK_BOT"));
    }

    if (member.kickable && msg.member.highestRole.position > member.highestRole.position) {
      await member.kick(encodeURI(`${reason.join(" ")} (kicked by: ${msg.author.tag})`));

      const embed = {
        title: t(lang, "KICK_SUCCESS", member.tag),
        description: t(lang, "REASON", reason.join(" ")),
        color: 0x18ff3d,
      };

      await msg.channel.createMessage({ embed });
    } else {
      let description;
      if (msg.member.highestRole.position <= member.highestRole.position) {
        description = t(lang, "MEMBER_ROLE_HIGHER");
      } else if (member.highestRole.position >= msg.guild.me.highestRole.position) {
        description = t(lang, "BOT_ROLE_HIGHER");
      } else if (msg.guild.me.permission.has("kickMembers")) {
        description = t(lang, "KICK_DONT_HAVE_PERMS");
      }

      const embed = {
        title: t(lang, "KICK_FAILED"),
        description,
        color: 0xff1835,
      };

      await msg.channel.createMessage({ embed });
    }
  }
}
