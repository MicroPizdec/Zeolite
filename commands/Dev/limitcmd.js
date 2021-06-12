module.exports = {
  name: "limitcmd",
  group: "DEV_GROUP",
  description: "LIMITCMD_DESCRIPTION",
  usage: "LIMITCMD_USAGE",
  ownerOnly: true,
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(msg.t("LIMITCMD_NO_ARGS_PROMPT", prefix));
    }

    let cmdName = args[0];
    if (!client.commands.has(cmdName)) {
      return msg.reply(msg.t("LIMITCMD_INVALID_COMMAND"));
    }
    if (client.commands.get(cmdName).ownerOnly) {
      return msg.reply(msg.t("LIMITCMD_INVALID_COMMAND"));
    }

    let disabledCmd = await disabledCmds.findOrCreate({ where: { name: cmdName } })
      .then(c => c[0]);
    if (disabledCmd.disabled) {
      return msg.reply(msg.t("COMMAND_ALREADY_LIMITED"));
    }

    await disabledCmd.update({ disabled: true });
    await msg.reply(msg.t("LIMITCMD_SUCCESS", cmdName));
  }
};
