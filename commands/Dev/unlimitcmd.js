module.exports = {
  name: "unlimitcmd",
  group: "DEV_GROUP",
  description: "UNLIMITCMD_DESCRIPTION",
  usage: "UNLIMITCMD_USAGE",
  ownerOnly: true,
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(_(lang, "UNLIMITCMD_NO_ARGS_PROMPT", prefix));
    }

    let cmdName = args[0];
    if (!client.commands.has(cmdName)) {
      return msg.channel.createMessage(_(lang, "UNLIMITCMD_INVALID_COMMAND"));
    }

    let disabledCmd = await disabledCmds.findOrCreate({ where: { name: cmdName } })
      .then(c => c[0]);
    if (!disabledCmd.disabled) {
      return msg.channel.createMessage(_(lang, "UNLIMITCMD_NOT_LIMITED"));
    }

    await disabledCmd.update({ disabled: false });
    await msg.channel.createMessage(_(lang, "UNLIMITCMD_SUCCESS", cmdName));
  }
}
