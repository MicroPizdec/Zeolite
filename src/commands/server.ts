import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from "zeolitecore";
import { Constants } from 'eris';

enum BoostLevels {
  TIER_1 = 1,
  TIER_2,
  TIER_3,
}

export default class ServerCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'server',
      description: 'Shows server info',
      group: 'general',
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const createdDays = Math.floor((Date.now() - ctx.guild!.createdAt) / (1000 * 86400));
    const owner = await this.client.getRESTUser(ctx.guild?.ownerID!);

    const textChannels = ctx.guild!.channels.filter((c) => c.type == 0).length;
    const voiceChannels = ctx.guild!.channels.filter((c) => c.type == 2).length;

    const staticEmojis = ctx.guild!.emojis.filter((e) => !e.animated).length;
    const animatedEmojis = ctx.guild!.emojis.filter((e) => e.animated).length;

    const embed = new Embed()
      .setAuthor({ name: ctx.guild!.name })
      .setThumbnail(ctx.guild?.iconURL!)
      .setColor(ctx.get('embColor'))
      .addField(ctx.t('serverOwner'), `${owner.username}#${owner.discriminator}`)
      .addField(
        ctx.t('serverVerificationLevel'),
        ctx.t(Object.keys(Constants.VerificationLevels)[ctx.guild!.verificationLevel]),
      )
      .addField(ctx.t('serverChannels'), ctx.t('serverChannelsDesc', textChannels, voiceChannels), true)
      .addField(ctx.t('serverMembers'), ctx.guild!.memberCount.toString(), true)
      .addField(ctx.t('serverEmojis'), ctx.t('serverEmojisDesc', staticEmojis, animatedEmojis), true)
      .addField(ctx.t('serverRolesCount'), ctx.guild!.roles.size.toString())
      .setFooter({ text: ctx.t('serverFooter', ctx.guild!.id, createdDays) })
      .setTimestamp(new Date(ctx.guild!.createdAt).toISOString());

    if (ctx.guild?.description) embed.setDescription(ctx.guild.description);

    if (ctx.guild!.premiumTier) {
      embed
        .addField(ctx.t('serverBoostLevel'), BoostLevels[ctx.guild?.premiumTier!].toString(), true)
        .addField(ctx.t('serverBoosts'), ctx.guild!.premiumSubscriptionCount!.toString(), true);
    }

    // this will be released in future
    /* if (ctx.guild!.features.length) {
      const features = ctx.guild!.features.map(f => `\`${ctx.t(f)}\``).join(", ");
      embed.addField(ctx.t("serverFeatures"), features);
    } */

    await ctx.reply({ embeds: [embed] });
  }
}
