const moment = require("moment");

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
    else member = msg.mentions.length ?
      msg.guild.members.get(msg.mentions[0].id) :
      msg.guild.members.find(m =>
        m.nick && m.nick.toLowerCase().startsWith(userID.toLowerCase()) ||
        m.tag.toLowerCase().startsWith(userID.toLowerCase()) ||
        m.id == userID
        ) || client.users.find(u => u.tag == userID) || await client.fetchUser(args[0]);
        
    if (!member) return msg.channel.createMessage(t(language, "USER_NOT_FOUND"));

    const joinPos = member.joinedAt ? msg.guild.members.map(m => m.joinedAt)
    .sort((a, b) => a - b).indexOf(member.joinedAt) + 1 : 0;

    moment.locale(language);

    const userBalance = (await zetCoins.findOrCreate({ where: { user: member.id } }))[0];

    const createdDaysAgo = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));
    const joinedDaysAgo = Math.floor((Date.now() - member.joinedAt) / (1000 * 86400));

    let roleList;
    if (member.roleObjects) roleList = Array.from(member.roleObjects.values())
      .sort((a, b) => b.position - a.position)
      .map(r => r.mention)
      .join(", ");

    const balances = await zetCoins.findAll()
      .then(bals => bals.sort((a, b) => b.balance - a.balance))
      .then(bals => bals.filter(b => client.users.has(b.user)) || !client.users.get(b.user).bot);

    const globalTopPos = balances.findIndex(b => b.user == member.id) + 1;
    const topPos = balances.filter(b => msg.guild.members.has(b.user))
      .findIndex(b => b.user == member.id) + 1;

    let nick = member.tag;
    if (member.nick) nick += ` (${member.nick})`;

    const embed = {
      author: {
        name: nick,
        icon_url: member.avatarURL,
      },
      description: joinPos ? t(language, "USERINFO_JOINPOS", joinPos) : t(language, "NOT_IN_SERVER"),
      color: member.color,
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
      fields: [
        {
          name: "ID",
          value: member.id,
        },
        {
          name: t(language, "USERINFO_REGDATE"),
          value: moment(member.createdAt).format("lll") + " " + _(language, "USERINFO_CREATED_DAYS_AGO", createdDaysAgo),
          inline: true,
        },
        {
          name: t(language, "USERINFO_BOT_TITLE"),
          value: t(language, "USERINFO_BOT_DEFINE", member.bot),
        },
        {
          name: t(language, "USERINFO_ZETCOINS_TITLE"),
          value: t(language, "USERINFO_ZETCOINS_BALANCE", userBalance.balance),
        },
        {
          name: t(language, "USERINFO_ZETCOINS_TOP"),
          value: t(language, "USERINFO_ZETCOINS_TOP_POS", globalTopPos, topPos || "n/a"),
        },
      ],
    };

    let indexInc = 0;
    if (member.joinedAt) {
      embed.fields.splice(2, 0, {
        name: t(language, "USERINFO_JOINDATE"),
        value: moment(member.joinedAt).format("lll") + " " + _(language, "USERINFO_CREATED_DAYS_AGO", joinedDaysAgo)
      });
      indexInc++;
    }

    if (roleList) embed.fields.splice(3 + indexInc, 0, {
      name: t(language, "USERINFO_ROLES"),
      value: roleList,
    });

    await msg.channel.createMessage({ embed });
  }
}
