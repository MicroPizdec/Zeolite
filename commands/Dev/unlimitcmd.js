module.exports = {
  name: "unlimitcmd",
  group: "DEV_GROUP",
  description: "UNLIMITCMD_DESCRIPTION",
  usage: "UNLIMITCMD_USAGE",
  ownerOnly: true,
  argsRequired: true,
  aliases: [ "enablecmd" ],
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(msg.t("UNLIMITCMD_NO_ARGS_PROMPT", prefix));
    }

    let cmdName = args[0];
    if (!client.commands.has(cmdName)) {
      return msg.reply(msg.t("UNLIMITCMD_INVALID_COMMAND"));
    }

    let disabledCmd = await disabledCmds.findOrCreate({ where: { name: cmdName } })
      .then(c => c[0]);
    if (!disabledCmd.disabled) {
      return msg.reply(msg.t("UNLIMITCMD_NOT_LIMITED"));
    }

    await disabledCmd.update({ disabled: false });
    await msg.reply(msg.t("UNLIMITCMD_SUCCESS", cmdName));
  }
}
