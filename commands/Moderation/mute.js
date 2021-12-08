global.muteTimers = new Map();

function parseTime(time) {
  if (!time) return;
  let timeNumber = parseInt(time.substr(0, time.length - 1)) * 1000;

  if (time.endsWith("s")) timeNumber *= 1;
  if (time.endsWith("m")) timeNumber *= 60;
  if (time.endsWith("h")) timeNumber *= 3600;
  if (time.endsWith("d")) timeNumber *= 86400;

  return timeNumber;
}

module.exports = {
    name: "mute",
    group: "MODERATION_GROUP",
    description: "MUTE_DESCRIPTION",
    usage: "MUTE_USAGE",
    requiredPermissions: "kickMembers",
    argsRequired: true,
    async run(client, msg, args, prefix) {
    let [ userID, time, ...reason ] = args;
    const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
      msg.guild.members.find(m => m.id === userID || m.tag === userID);
    if (!member) {
      return msg.reply(msg.t("USER_NOT_FOUND"));
    };

    const parsedTime = parseTime(time);
    if (parsedTime > 604800000) {
      return msg.reply(msg.t("MUTE_TOO_LONG"));
    }
    
    if (!parsedTime) reason.unshift(time);
    
    try {
      if (member.id === msg.author.id)
        return msg.reply(msg.t("CANT_MUTE_YOURSELF"));
      if (member.id === client.user.id)
        return msg.reply(msg.t("CANT_MUTE_BOT"));

      let mutedRole = msg.guild.roles.find(r => r.name === "Muted");
      if (!mutedRole) {
        mutedRole = await msg.guild.createRole({
          name: "Muted",
          mentionable: false,
        });
        
        for (const channel of msg.guild.channels.values()) {
          try {
            await channel.editPermission(mutedRole.id, 0, 6144, "role");
          } catch {}
        }
      }
      
      if (member.roles.includes(mutedRole.id))
        return msg.reply(msg.t("USER_ALREADY_MUTED"));

      await member.addRole(mutedRole.id);
      const embed = {
        title: msg.t("MUTE_SUCCESS", member),
        description: msg.t("REASON", reason.join(" ")),
        color: 0x57f287,
        timestamp: new Date().toISOString(),
        footer: { text: msg.t("CAN_UNMUTE_FOOTER", prefix) },
      };

      await msg.reply({ embed });
      if (parsedTime) {
        if (!muteTimers.has(msg.guild.id)) {
          muteTimers.set(msg.guild.id, new Map());
        }
        guildMuteTimers = muteTimers.get(msg.guild.id);
        guildMuteTimers.set(member.id, setTimeout(() => member.removeRole(mutedRole.id).catch(e => client.logger.warn(e.stack)), parsedTime));
        setTimeout(() => {
          clearTimeout(guildMuteTimers.get(member.id));
          guildMuteTimers.delete(member.id);
        }, parsedTime);
      }
    } catch (err) {
      let description;
      if (!msg.guild.members.get(client.user.id).permission.has("manageRoles")) {
        description = msg.t("MUTE_DONT_HAVE_PERMS");
      }
      else if (member.id === msg.guild.ownerID) {
        description = msg.t("USER_IS_OWNER");
      }
      else if (member.highestRole.position >= msg.guild.members.get(client.user.id).highestRole.position) {
        description = msg.t("BOT_ROLE_HIGHER");
      }
      else {
        description = msg.t("SOMETHING_WENT_WRONG");
        client.emit("commandError", this.name, msg, err, false);
      }

      const embed = {
        title: msg.t("MUTE_FAIL"),
        description,
        color: 0xed4245,
      };
      await msg.reply({ embed });
    }
  }	
};