const { Member } = require("eris");

Member.prototype.dynamicAvatarURL = function (format, size) {
  return this.user.dynamicAvatarURL(format, size);
}

module.exports = {
  name: "avatar",
  group: "BASIC_GROUP",
  description: "AVATAR_DESCRIPTION",
  usage: "AVATAR_USAGE",
  aliases: [ "profilepicture", "av", "pfp", ],
  async run(client, msg, args, prefix, lang) {
    if (args[0] === "-s" || args[0] == "server") {
      const guild = client.owners.includes(msg.author.id) ?
        client.guilds.get(args[1]) || msg.guild : msg.guild;

      const embed = {
        author: {
          name: t(lang, "SERVER_ICON", guild.name),
          url: guild.iconURL,
        },
        image: { url: guild.iconURL },
        color: await msg.author.embedColor(),
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

      color: await msg.author.embedColor(),
      image: { url: user.dynamicAvatarURL(format, 2048) },
    };
    await msg.channel.createEmbed(embed);
  }
};
