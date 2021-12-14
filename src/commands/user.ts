import { MessageEmbed, User, UserFlags, UserFlagsString } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import { DateTime } from "luxon";

/* function addOrdinalSuffix(i: number): string {
  let j = i % 10, k = i % 100;
  
  if (j == 1 && k != 11) {
    return `${i}st`;
  } else if (j == 2 && k != 12) {
    return `${i}nd`;
  } else if (j == 3 && k != 13) {
    return `${i}rd`;
  } else {
    return `${i}th`;
  }
} */

const badgeEmojis: Record<string, string> = {
  DISCORD_EMPLOYEE: "<:discordEmployee:822406071497916446>",
  PARTNERED_SERVER_OWNER: "<:partneredServerOwner:822406071531864075>",
  HYPESQUAD_EVENTS: "<:hypesquadEvents:822406071750492200>",
  BUGHUNTER_LEVEL_1: "<:bugHunterLvl1:822406071024222209>",
  HOUSE_BRAVERY: "<:hypesquadBravery:822406071603560508>",
  HOUSE_BRILLIANCE: "<:hypesquadBrilliance:822406071468949504>",
  HOUSE_BALANCE: "<:hypesquadBalance:822406071355703297>",
  EARLY_SUPPORTER: "<:earlySupporter:822406071246782506>",
  BUGHUNTER_LEVEL_2: "<:bugHunterLvl2:822406071544447046>",
  EARLY_VERIFIED_BOT_DEVELOPER: "<:earlyVerifiedBotDev:822406071598448661>",
  DISCORD_CERTIFIED_MODERATOR: "<:discordCertifiedModerator:920292241669500928>",
  VERIFIED_BOT: "<:verifiedBot1:822406119275888650><:verifiedBot2:822406118751731753>",
  BOT: "<:bot:822406071473012736>",
};

function getUserBadges(user: User): string {
  const badges: string[] = [];

  if (user.bot && !((user.flags?.bitfield as number) & UserFlags.FLAGS.VERIFIED_BOT)) {
    badges.push(badgeEmojis.BOT);
  }

  for (const flag in UserFlags.FLAGS) {
    if (!!((user.flags?.bitfield as number) & UserFlags.FLAGS[flag as UserFlagsString])) {
      badges.push(badgeEmojis[flag]);
    }
  }

  return badges.join(" ");
}

export default class UserCommand extends ZeoliteCommand {
  name = "user";
  description = "Information about provided user. Defaults to you.";
  options = [
    {
      type: 6,
      name: "user",
      description: "A user",
      required: false,
    },
  ];

  async run(ctx: ZeoliteContext) {
    const user = ctx.interaction.options.getUser("user") || ctx.user;
    const member = ctx.guild?.members.cache.has(user.id) ?
      ctx.guild.members.cache.get(user.id) :
      await ctx.guild?.members.fetch(user).catch(() => {});

    const registeredDays = Math.floor((Date.now() - user.createdTimestamp) / (1000 * 86400));

    const embed = new MessageEmbed()
      .setAuthor(user.tag)
      .setThumbnail(user.displayAvatarURL())
      .setColor(member?.displayColor || 0x9f00ff)
      .addField(ctx.t("userBadges"), getUserBadges(user) || ctx.t("userBadgesNone"))
      .setFooter(ctx.t("userFooter", user.id, registeredDays))
      .setTimestamp(user.createdAt);
    
    if (member) {
      const formattedJoinDate = DateTime.fromMillis(member.joinedTimestamp as number)
        .setLocale(ctx.t("langName"))
        .toFormat("fff");

      embed.addField(ctx.t("userJoinDate"), formattedJoinDate)
        .addField(ctx.t("userRoles"), member.roles.cache.filter(r => r.name != "@everyone").map(r => r.toString()).join(", ") || ctx.t("userBadgesNone"));
    }
    
    await ctx.reply({ embeds: [ embed ] });
  }
}