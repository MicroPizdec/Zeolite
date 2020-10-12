module.exports = {
  name: "avatar",
  group: "BASIC_GROUP",
  description: "AVATAR_DESCRIPTION",
  usage: "AVATAR_USAGE",
  async run(client, msg, args, prefix, lang) {
    if (args[0] === "-s") {
      const embed = {
        author: {
          name: _(lang, "SERVER_ICON"),
          url: msg.guild.iconURL,
        },
        image: { url: msg.guild.iconURL },
        color: Math.round(Math.random() * 16777216),
      };

      return msg.channel.createMessage({ embed });
    } 

    let user, userID = args.raw.join(" ");
    if (!args[0]) user = msg.author;
    else user = msg.mentions.length ? msg.mentions[0] :
      msg.guild.members.find(m => m.effectiveName.toLowerCase().startsWith(userID)) ||
      client.users.find(u => u.tag == userID || u.id == userID);
    if (!user) return msg.channel.createMessage(_(lang, "INVALID_USER_PROVIDED"));
    if (user.user) user = user.user;
    
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
