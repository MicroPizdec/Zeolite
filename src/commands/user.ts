import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import { User, Constants } from 'oceanic.js';
import Utils from '../utils/Utils';

export default class UserCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'user',
      description: 'Information about provided user',
      group: 'general',
      options: [
        {
          type: 6,
          name: 'user',
          description: 'A user. Default is you',
          required: false,
        },
      ],
    });
  }

  private badgeEmojis: Record<string, string> = {
    STAFF: '<:discordEmployee:822406071497916446>',
    PARTNER: '<:partneredServerOwner:822406071531864075>',
    HYPESQUAD: '<:hypesquadEvents:822406071750492200>',
    BUG_HUNTER_LEVEL_1: '<:bugHunterLvl1:822406071024222209>',
    HYPESQUAD_BRAVERY: '<:hypesquadBravery:822406071603560508>',
    HYPESQUAD_BRILLIANCE: '<:hypesquadBrilliance:822406071468949504>',
    HYPESQUAD_BALANCE: '<:hypesquadBalance:822406071355703297>',
    EARLY_SUPPORTER: '<:earlySupporter:822406071246782506>',
    BUG_HUNTER_LEVEL_2: '<:bugHunterLvl2:822406071544447046>',
    VERIFIED_DEVELOPER: '<:earlyVerifiedBotDev:822406071598448661>',
    CERTIFIED_MODERATOR: '<:discordCertifiedModerator:920292241669500928>',
    VERIFIED_BOT: '<:verifiedBot1:822406119275888650><:verifiedBot2:822406118751731753>',
    BOT: '<:bot:822406071473012736>',
    ACTIVE_DEVELOPER: '<:activeDeveloper:1049285423098236998>',
  };

  public async run(ctx: ZeoliteContext) {
    const user = ctx.options.getUser('user') || ctx.user;
    const member = await ctx.guild?.getMember(user.id).catch(() => {});

    const registeredDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 86400));

    const embed = new Embed()
      .setAuthor({ name: user.globalName || user.username })
      .setThumbnail(member ? member.avatarURL() : user.avatarURL())
      .setColor(ctx.get('embColor'))
      .addField(ctx.t('userUsername'), Utils.getUserTag(user))
      .addField(ctx.t('userBadges'), this.getUserBadges(user) || ctx.t('userBadgesNone'))
      .setFooter({ text: ctx.t('userFooter', user.id, registeredDays) })
      .setTimestamp(user.createdAt.toISOString());

    if (member) {
      embed
        .addField(ctx.t('userJoinDate'), `<t:${Math.floor(member.joinedAt!.getTime() / 1000)}>`)
        .addField(ctx.t('userRoles'), member.roles.map((r) => `<@&${r}>`).join(', ') || ctx.t('userBadgesNone'));
    }

    if (member?.voiceState?.channelID) {
      embed.addField(ctx.t("userVoiceChannel"), `<#${member?.voiceState.channelID}>`);
    }

    await ctx.reply({ embeds: [embed] });
  }

  private getUserBadges(user: User): string {
    const badges: string[] = [];

    if (user.bot && !((user.publicFlags as number) & Constants.UserFlags.VERIFIED_BOT)) {
      badges.push(this.badgeEmojis.BOT);
    }

    for (const flag in Constants.UserFlags) {
      if (
        !!(user.publicFlags & Constants.UserFlags[flag as keyof typeof Constants.UserFlags]) &&
        (flag as keyof typeof Constants.UserFlags) != 'PSEUDO_TEAM_USER'
      ) {
        badges.push(this.badgeEmojis[flag]);
      }
    }

    return badges.join(' ');
  }
}
