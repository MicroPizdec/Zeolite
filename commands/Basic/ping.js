module.exports = {
  name: "ping",
  group: "BASIC_GROUP",
  description: "PING_COMMAND_DESCRIPTION",
  async run(client, msg, args, prefix, language) {
    const embed = {
      title: client.i18n.getTranslation(language, "PING_EMBED_TITLE"),
      description: client.i18n.getTranslation(language, "PING_EMBED_DESCRIPTION", client.shards.map(s => s.latency)[0]),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
    await msg.channel.createMessage({ embed });
  }
};
