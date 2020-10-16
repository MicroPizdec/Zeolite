module.exports = {
  name: "unbancommands",
  group: "DEV_GROUP",
  description: "UNBANCOMMANDS_DESCRIPTION",
  usage: "UNBANCOMMANDS_USAGE",
  ownerOnly: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(_(lang, "UNBANCOMMANDS_NO_ARGS_PROMPT", prefix));
    }

    const user = msg.mentions[0] || client.users.get(args[0]);
    if (!user) {
      return msg.channel.createMessage(_(lang, "INVALID_USER_PROVIDED"));
    }

    const { banned } = (await commandBans.findOrCreate({ where: { user: user.id } }))[0];
    if (!banned) {
      return msg.channel.createMessage(_(lang, "UNBANCOMMANDS_USER_ISNT_BANNED"));
    }
    
    await commandBans.update({
      banned: false,
      reason: null,
    }, { where: { user: user.id } });

    const embed = {
      title: _(lang, "UNBANCOMMANDS_SUCCESSFUL_UNBAN", user),
      color: 3066993,
      timestamp: new Date().toISOString(),
    };

    await msg.channel.createEmbed(embed);
  }
};
