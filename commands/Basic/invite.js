function isCorrectInvite(invite) {
  const inviteArray = invite.split("/");
  inviteArray.pop();

  const link = inviteArray.join('/');

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
      color: await msg.author.embedColor(),
      fields: [
        {
          name: _(lang, "INVITE_MEMBERS"),
          value: inviteInfo.memberCount,
          inline: true,
        },
        {
          name: _(lang, "INVITE_VERIFICATION_LEVEL"),
          value: _(lang, "INVITE_VERIFICATION_LEVELS")[inviteInfo.guild.verificationLevel],
          inline: true,
        },
        {
          name: "ID:",
          value: inviteInfo.guild.id,
          inline: false,
        },
        {
          name: _(lang, "INVITE_CHANNEL"),
          value: `#${inviteInfo.channel.name} (ID: ${inviteInfo.channel.id})`,
        },
      ],
      footer: { text: _(lang, "INVITE_CODE", inviteInfo.code) },
    };

    if (inviteInfo.inviter) {
      embed.fields.push({
        name: _(lang, "INVITE_INVITER"),
        value: `${inviteInfo.inviter.tag} (ID: ${inviteInfo.inviter.id})`,
      });
    }

    await msg.channel.createMessage({ embed });
  }
}
