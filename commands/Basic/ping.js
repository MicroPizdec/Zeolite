module.exports = {
  name: "ping",
  group: "BASIC_GROUP",
  description: "PING_COMMAND_DESCRIPTION",
  async run(client, msg, args, prefix, language) {
    const startTime = Date.now();
    const message = await msg.channel.createMessage("<a:d_typing:791621737880092700>");

    const embed = {
      title: t(language, "PING_BOT", msg.guild.shard.latency),
      description: t(language, "PING_API", Math.floor(Date.now() - startTime)),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
    await message.edit({ content: "", embed });
  }
};
