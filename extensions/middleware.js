module.exports.load = client => {
  client.addMiddleware(async msg => {
    let language = (await userLanguages.findOrCreate({ where: { user: msg.author.id } }))[0];
    if (!language.overriden) {
      if (msg.channel.guild)
        language = (await languages.findOrCreate({ where: { server: msg.channel.guild.id } }))[0];
      else language = { language: "en" };
    }
    return msg.author.lang = language.language;
  }, true);

  client.addMiddleware(async (msg, prefix) => {
    const { banned: areCommandsBanned, reason } = (await commandBans.findOrCreate({ where: { user: msg.author.id } }))[0];
    if (areCommandsBanned) {
      const embed = {
        title: msg.t("COMMANDS_BANNED"),
        description: msg.t("COMMANDS_BANNED_REASON", reason),
        color: 15158332,
      };
      await msg.channel.createEmbed(embed);
      return false;
    }
    return true;
  }, true)

  client.addMiddleware(async (msg, prefix, data) => {
    if (msg.content.replace("<@!", "<@") === client.user.mention) {
      await client.commands.get("prefix").run(client, msg, [], prefix);
      return false;
    }

    return true;
  }, false);
}