const moment = require("moment");
const { Constants: { UserFlags }, Member } = require("eris");
const { lang } = require("moment");

const badgeEmojis = {
  DISCORD_EMPLOYEE: "<:discordEmployee:822406071497916446>",
  DISCORD_PARTNER: "<:partneredServerOwner:822406071531864075>",
  HYPESQUAD_EVENTS: "<:hypesquadEvents:822406071750492200>",
  BUG_HUNTER_LEVEL_1: "<:bugHunterLvl1:822406071024222209>",
  HOUSE_BRAVERY: "<:hypesquadBravery:822406071603560508>",
  HOUSE_BRILLIANCE: "<:hypesquadBrilliance:822406071468949504>",
  HOUSE_BALANCE: "<:hypesquadBalance:822406071355703297>",
  EARLY_SUPPORTER: "<:earlySupporter:822406071246782506>",
  BUG_HUNTER_LEVEL_2: "<:bugHunterLvl2:822406071544447046>",
  VERIFIED_BOT_DEVELOPER: "<:earlyVerifiedBotDev:822406071598448661>",
  VERIFIED_BOT: "<:verifiedBot1:822406119275888650><:verifiedBot2:822406118751731753>",
  BOT: "<:bot:822406071473012736>",
};

function getUserBadges(user) {
  if (user instanceof Member) user = user.user;

  const badges = [];

  if (user.bot && !(user.publicFlags & UserFlags.VERIFIED_BOT)) badges.push(badgeEmojis.BOT);

  for (const flag in UserFlags) {
    if (!!(user.publicFlags & UserFlags[flag])) {
      badges.push(badgeEmojis[flag]);
    }
  }

  return badges;
}

function intToHex(num) {
  let hex = num.toString(16);

  while (hex.length < 6) {
    hex = "0" + hex;
  }

  return hex;
}

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
        
    if (!member) return msg.reply(t(language, "USER_NOT_FOUND"));

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
      color: member.color || await msg.author.embedColor(),
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
          name: t(language, "USERINFO_BADGES"),
          value: getUserBadges(member).join(" ") || t(language, "USERINFO_NO_BADGES"),
        },
        {
          name: t(language, "USERINFO_REGDATE"),
          value: moment(member.createdAt).format("lll") + " " + t(language, "DAYS_AGO", createdDaysAgo),
          inline: true,
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
        value: moment(member.joinedAt).format("lll") + " " + _(language, "DAYS_AGO", joinedDaysAgo)
      });
      indexInc++;
    }

    if (roleList) embed.fields.splice(3 + indexInc, 0, {
      name: t(language, "USERINFO_ROLES"),
      value: roleList,
    },
    {
      name: t(language, "USERINFO_COLOR"),
      value: member.color ? `#${intToHex(member.color)}` : t(language, "USERINFO_DEFAULT_COLOR"),
    });

    await msg.reply({ embed });
  }
}
