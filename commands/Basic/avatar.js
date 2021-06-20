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

      if(!guild.icon) return await msg.reply(msg.t("NO_ICON"))

      const embed = {
        author: {
          name: msg.t("SERVER_ICON", guild.name),
          url: guild.iconURL,
        },
        image: { url: guild.iconURL },
        color: await msg.author.embedColor(),
      };

      return msg.reply({ embed });
    } 

    if (args[0] === "-sp" || args[0] == "splash") {
      const guild = client.owners.includes(msg.author.id) ?
        client.guilds.get(args[1]) || msg.guild : msg.guild;
      
      if(!guild.splash) return await msg.reply(msg.t("NO_SPLASH"))

      const embed = {
        author: {
          name: msg.t("SERVER_SPLASH", guild.name),
          url: guild.dynamicSplashURL("png", 4096),
        },
        image: { url: guild.dynamicSplashURL("png", 4096) },
        color: await msg.author.embedColor(),
      };

      return msg.reply({ embed });
    } 

    if (args[0] === "-b" || args[0] == "banner") {
      const guild = client.owners.includes(msg.author.id) ?
        client.guilds.get(args[1]) || msg.guild : msg.guild;
      
      if(!guild.banner) return await msg.reply(msg.t("NO_BANNER"))

      const embed = {
        author: {
          name: msg.t("SERVER_BANNER", guild.name),
          url: guild.dynamicBannerURL("png", 4096),
        },
        image: { url: guild.dynamicBannerURL("png", 4096) },
        color: await msg.author.embedColor(),
      };

      return msg.reply({ embed });
    } 

    const user = args[0] ? msg.mentions.length ? msg.mentions[0] :
      msg.guild.members.find(m =>
        m.nick && m.nick.toLowerCase().startsWith(args[0].toLowerCase()) ||
        m.tag.toLowerCase().startsWith(args[0].toLowerCase())
      ) || client.users.find(u => u.tag == args[0]) || await client.fetchUser(args[0]) : msg.author;

    if (!user) return msg.reply(msg.t("USER_NOT_FOUND"));

    const guildAvatarHash = await client.requestHandler.request("GET", `/guilds/${msg.guild.id}/members/${user.id}`, true)
    .then(r => r.avatar)
    .catch(() => {});

    let format;
    if (user.avatar) {
      format = user.avatar.startsWith("a_") ? 'gif' : 'png';
    }

    const avatar = guildAvatarHash ? `https://cdn.discordapp.com/guilds/${msg.guild.id}/users/${user.id}/avatars/${guildAvatarHash}.${guildAvatarHash.startsWith("a_") ? "gif" : "png"}?size=2048` : user.dynamicAvatarURL(format, 2048);

    const embed = {
      author: {
        name: msg.t("AVATAR_USER", user),
        url: avatar,
      },

      color: await msg.author.embedColor(),
      image: { url: avatar },
    };
    await msg.reply({ embed });
  }
};
