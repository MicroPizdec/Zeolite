const { Member } = require("eris");

Member.prototype.dynamicAvatarURL = function (format, size) {
  return this.user.dynamicAvatarURL(format, size);
}

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

    const user = args[0] ? msg.mentions.length ? msg.mentions[0] :
      msg.guild.members.find(m =>
        m.nick && m.nick.toLowerCase().startsWith(args[0].toLowerCase()) ||
        m.tag.toLowerCase().startsWith(args[0].toLowerCase())
      ) || client.users.get(args[0]) : msg.author;

    if (!user) return msg.channel.createMessage(t(lang, "USER_NOT_FOUND"));

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
