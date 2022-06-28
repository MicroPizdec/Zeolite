import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import { User, Constants } from 'eris';

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
    DISCORD_EMPLOYEE: '<:discordEmployee:822406071497916446>',
    PARTNERED_SERVER_OWNER: '<:partneredServerOwner:822406071531864075>',
    HYPESQUAD_EVENTS: '<:hypesquadEvents:822406071750492200>',
    BUGHUNTER_LEVEL_1: '<:bugHunterLvl1:822406071024222209>',
    HOUSE_BRAVERY: '<:hypesquadBravery:822406071603560508>',
    HOUSE_BRILLIANCE: '<:hypesquadBrilliance:822406071468949504>',
    HOUSE_BALANCE: '<:hypesquadBalance:822406071355703297>',
    EARLY_SUPPORTER: '<:earlySupporter:822406071246782506>',
    BUGHUNTER_LEVEL_2: '<:bugHunterLvl2:822406071544447046>',
    EARLY_VERIFIED_BOT_DEVELOPER: '<:earlyVerifiedBotDev:822406071598448661>',
    DISCORD_CERTIFIED_MODERATOR: '<:discordCertifiedModerator:920292241669500928>',
    VERIFIED_BOT: '<:verifiedBot1:822406119275888650><:verifiedBot2:822406118751731753>',
    BOT: '<:bot:822406071473012736>',
  };

  public async run(ctx: ZeoliteContext) {
    const user = (await ctx.options.getUser('user')) || ctx.user;
    const member = await ctx.guild?.getRESTMember(user?.id!).catch(() => {});

    const registeredDays = Math.floor((Date.now() - user!.createdAt) / (1000 * 86400));

    const embed = new Embed()
      .setAuthor({ name: `${user?.username}#${user?.discriminator}` })
      .setThumbnail(member ? member.avatarURL : user?.avatarURL!)
      .setColor(ctx.get('embColor'))
      .addField(ctx.t('userBadges'), this.getUserBadges(user!) || ctx.t('userBadgesNone'))
      .setFooter({ text: ctx.t('userFooter', user!.id, registeredDays) })
      .setTimestamp(new Date(user!.createdAt).toISOString());

    if (member) {
      embed
        .addField(ctx.t('userJoinDate'), `<t:${Math.floor((member.joinedAt as number) / 1000)}>`)
        .addField(ctx.t('userRoles'), member.roles.map((r) => `<@&${r}>`).join(', ') || ctx.t('userBadgesNone'));
    }

    /*if (member?.voice.channelId) {
      embed.addField(ctx.t("userVoiceChannel"), `<#${member?.voice.channelId}>`);
    }*/

    await ctx.reply({ embeds: [embed] });
  }

  private getUserBadges(user: User): string {
    const badges: string[] = [];

    if (user.bot && !((user.publicFlags as number) & Constants.UserFlags.VERIFIED_BOT)) {
      badges.push(this.badgeEmojis.BOT);
    }

    for (const flag in Constants.UserFlags) {
      if (
        !!((user.publicFlags as number) & Constants.UserFlags[flag as keyof Constants['UserFlags']]) &&
        (flag as keyof Constants['UserFlags']) != 'TEAM_USER' &&
        (flag as keyof Constants['UserFlags']) != 'TEAM_PSEUDO_USER'
      ) {
        badges.push(this.badgeEmojis[flag]);
      }
    }

    return badges.join(' ');
  }
}
