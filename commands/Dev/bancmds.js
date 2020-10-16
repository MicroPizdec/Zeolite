 module.exports = {
  name: "bancommands",
  group: "DEV_GROUP",
  description: "BANCOMMANDS_COMMAND_DESCRIPTION",
  usage: "BANCOMMANDS_COMMAND_USAGE",
  ownerOnly: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(_(lang, "BANCOMMANDS_NO_ARGS_PROMPT", prefix));

    const [ userID, ...reason ] = args;

    const member = msg.mentions[0] || client.users.get(userID);
    if (!member) return msg.channel.createMessage(_(lang, "INVALID_USER_PROVIDED"));

    if (member.id === msg.author.id)
      return msg.channel.createMessage(_(lang, "BANCOMMANDS_CANT_BAN_SELF"));
    if (client.owners.includes(member.id))
      return msg.channel.createMessage(_(lang, "BANCOMMANDS_CANT_BAN_OTHER_BOT_OWNER"));

    const banned = await isAlreadyBanned(member);
    if (banned)
      return msg.channel.createMessage(_(lang, "BANCOMMANDS_USER_ALREADY_BANNED"));

    await commandBans.update({
      banned: true,
      reason: reason.join(" "),
    }, { where: { user: member.id } });

    const embed = {
      author: {
        name: _(lang, "BANCOMMANDS_SUCCESSFUL_BAN", member),
        icon_url: member.avatarURL,
      },
      color: 3066993,
      description: _(lang, "BANCOMMANDS_BAN_REASON", reason.join(" ")),
    }

    await msg.channel.createEmbed(embed);
  }
};

async function isAlreadyBanned(user) {
  return (await commandBans.findOrCreate({ where: { user: user.id } }))[0].banned;
}
