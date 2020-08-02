function isCorrectInvite(invite) {
  const inviteArray = invite.split("/");
  inviteArray.pop();

  const link = invite.join('/');

  return inviteArray.length ? link == "https://discord.gg" || link == "https://discord.com/invite"
    || link == "https://discordapp.com/invite" : true // убрать в будущем
}

function parseInvite(invite) {
  return invite.split("/").pop();
}

function getGuildIconURL(guild) {
  if (!guild.icon) return null;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
}

module.exports = {
  name: "invite",
  group: "BASIC_GROUP",
  description: "INVITE_DESCRIPTION",
  usage: "INVITE_USAGE",
  aliases: [ "i", "inviteinfo" ],
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(_(lang, "INVITE_NO_ARGS", prefix));
    }

    let invite = args[0];
    
    if (!isCorrectInvite(invite)) {
      return msg.channel.createMessage(_(lang, "INVITE_INVALID"));
    }

    let inviteInfo;
    try {
      inviteInfo = await client.getInvite(parseInvite(invite), true);
    } catch {
      return msg.channel.createMessage(_(lang, "INVITE_INVALID"));
    }

    const embed = {
      author: {
        name: inviteInfo.guild.name,
        icon_url: getGuildIconURL(inviteInfo.guild),
      },
      color: Math.round(Math.random() * 16777216),
      fields: [
        {
          name: _(lang, "INVITE_MEMBERS"),
          value: inviteInfo.memberCount,
          inline: false,
        },
        {
          name: _(lang, "INVITE_")
        }
      ]
    }
  }
}