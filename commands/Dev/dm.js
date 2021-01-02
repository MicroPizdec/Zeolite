module.exports = {
  name: "dm",
  group: "DEV_GROUP",
  description: "DM_COMMAND_DESCRIPTION",
  usage: "DM_COMMAND_USAGE",
  ownerOnly: true,
  argsRequired: true,
  async run(client, msg, args, prefix, language) {
    if (!args.length)
      return msg.channel.createMessage(_(language, "DM_NO_ARGS_PROMPT", prefix));

    let unparsedArgs = msg.content.slice(prefix.length + this.name.length + 1).split(" ");

    const userID = unparsedArgs.shift();
    const user = msg.mentions[0] || client.users.get(userID);

    if (!user) return msg.channel.createMessage(_(language, "INVALID_USER_PROVIDED"));
    if (!unparsedArgs.length) return msg.channel.createMessage(_(language, "DM_NO_CONTENT_TO_SEND"));

    const channel = await client.getDMChannel(user.id);
    await channel.createMessage(unparsedArgs.join(" "));
    await msg.addReaction("✅");

    const messages = await channel.awaitMessages(m => m.content.length, {
      maxMatches: 1,
      time: 604800000,
    });
    if (messages.length) {
      let embed = {
        author: {
          name: user.tag,
          icon_url: user.avatarURL,
        },
        title: _(language, "DM_ANSWER_SENT"),
        description: messages[0].content,
        color: Math.round(Math.random() * 16777216),
      };

      const authorChannel = await client.getDMChannel(msg.author.id);
      await authorChannel.createMessage({ embed });
    }
  }
}
