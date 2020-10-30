const strftime = require("strftime");

module.exports = {
  name: "user",
  group: "BASIC_GROUP",
  description: "USERINFO_COMMAND_DESCRIPTION",
  usage: "USERINFO_COMMAND_USAGE",
  aliases: [ "u", "userinfo" ],
  async run(client, msg, args, prefix, language) {
    let member;
    let userID = args[0];
    
    if (!userID) member = msg.member;
    else member = (await msg.guild.fetchMembers({ userIDs: [ msg.mentions.length ? msg.mentions[0].id : userID ] }))[0];
    if (!member) return;

    const userBalance = (await zetCoins.findOrCreate({ where: { user: member.id } }))[0];

    const createdDaysAgo = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));
    const joinedDaysAgo = Math.floor((Date.now() - member.joinedAt) / (1000 * 86400));
    
    const roleList = Array.from(member.roleObjects.values())
      .sort((a, b) => b.position - a.position)
      .map(r => r.mention)
      .join(", ");

    let nick = member.tag;
    if (member.nick) nick += ` (${member.nick})`;

    const embed = {
      author: {
        name: nick,
        icon_url: member.avatarURL,
      },
      color: member.color,
      footer: {
        text: `${client.user.username} © 2019-2020 ZariBros`,
        icon_url: client.user.avatarURL,
      },
      fields: [
        {
          name: "ID",
          value: member.id,
        },
        {
          name: t(language, "USERINFO_REGDATE"),
          value: strftime("%e %b %Y, %H:%M", new Date(member.createdAt)) + " " + _(language, "USERINFO_CREATED_DAYS_AGO", createdDaysAgo),
          inline: true,
        },
        {
          name: t(language, "USERINFO_JOINDATE"),
          value: strftime("%e %b %Y, %H:%M", new Date(member.joinedAt)) + " " + _(language, "USERINFO_CREATED_DAYS_AGO", joinedDaysAgo),
          inline: true,
        },
        {
          name: t(language, "USERINFO_BOT_TITLE"),
          value: t(language, "USERINFO_BOT_DEFINE", member.bot),
        },
        {
          name: t(language, "USERINFO_ROLES"),
          value: roleList,
        },
        {
          name: t(language, "USERINFO_ZETCOINS_TITLE"),
          value: t(language, "USERINFO_ZETCOINS_BALANCE", userBalance.balance),
        },
      ],
    };
    
    if (member.game) {
      if (!member.game.name) {
        return msg.channel.createMessage({ embed });
      }

      let emoji;
      if (member.game.emoji) {
        let animated = member.game.emoji.animated ? "a" : "";
        if (member.game.emoji.id) {
          emoji = `<${animated}:${member.game.emoji.name}:${member.game.emoji.id}>`;
        } else {
          emoji = member.game.emoji.name;
        }
      }
  
      switch (member.game.type) {
        case 4:
          embed.fields.unshift({
            name: t(language, "USERINFO_CUSTOM_STATUS"),
            value: emoji ? `${emoji} ${member.game.state || ""}` : member.game.state,
          });
          break;
        case 3:
          embed.fields.unshift({
            name: t(language, "USERINFO_WATCHING"),
            value: member.game.name,
          });
          break;
        case 2:
          embed.fields.unshift({
            name: t(language, "USERINFO_LISTENING"),
            value: member.game.name,
          });
          break;
        case 1:
          embed.fields.unshift({
            name: t(language, "USERINFO_STREAMING"),
            value: `[${member.game.name}](${member.game.url})`,
          });
          break;
        case 0:
          embed.fields.unshift({
            name: t(language, "USERINFO_PLAYING"),
            value: member.game.name,
          });
          break;
      }
    }

    await msg.channel.createMessage({ embed });
  }
}
