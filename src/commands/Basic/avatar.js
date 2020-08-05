module.exports = {
  name: "avatar",
  group: "BASIC_GROUP",
  description: "AVATAR_DESCRIPTION",
  usage: "AVATAR_USAGE",
  async run(client, msg, args, prefix, lang) {
    let user;
    if (!args[0]) user = msg.author;
    else user = msg.mentions[0] || client.users.get(args[0]);
    if (!user) return msg.channel.createMessage(_(lang, "INVALID_USER_PROVIDED"));
    
    let format;
    if (user.avatar) {
      format = user.avatar.startsWith("a_") ? 'gif' : 'png';
    }

    const embed = {
      author: {
        name: _(lang, "AVATAR_USER", user),
        url: user.dynamicAvatarURL(format, 4096),
      },

      color: Math.round(Math.random() * 16777216) + 1,
      image: { url: user.dynamicAvatarURL(format, 2048) },
    };
    await msg.channel.createEmbed(embed);
  }
};
