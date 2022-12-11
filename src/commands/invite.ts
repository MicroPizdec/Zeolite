import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import { Invite, InviteChannel, Constants } from 'oceanic.js';
import { getLogger } from 'log4js';

export default class InviteCommand extends ZeoliteCommand {
  private inviteRegex: RegExp = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi;

  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'invite',
      description: 'Shows information about provided invite',
      group: 'general',
      options: [
        {
          type: 3,
          name: 'invite',
          description: 'Invite code or URL',
          required: true,
        },
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    const url = ctx.options.getString('invite')!;

    let invite: Invite<'withCounts', InviteChannel> | undefined;
    try {
      const code = this.getInviteCodeFromURL(url);
      invite = await this.client.rest.channels.getInvite(code, { withCounts: true });
    } catch (e: any) {
      getLogger('InviteCommand').error(`Failed to get invite:\n${e.stack}`);
      await ctx.reply({ content: ctx.t('invalidInvite'), flags: 64 });
      return;
    }

    const embed = new Embed()
      .setTitle(invite.guild!.name)
      .setThumbnail(invite.guild?.iconURL()!)
      .setColor(ctx.get('embColor'))
      .addField(
        ctx.t('serverMembers'),
        ctx.t('inviteMembersCount', invite.approximateMemberCount, invite.approximatePresenceCount),
      )
      .addField(
        ctx.t('serverVerificationLevel'),
        ctx.t(Object.keys(Constants.VerificationLevels)[invite.guild!.verificationLevel]),
      )
      .addField('ID', invite.guild!.id)
      .addField(ctx.t('inviteChannel'), `#${invite.channel?.name} (ID: ${invite.channel?.id})`)
      .setFooter({ text: ctx.t('inviteFooter') })
      .setTimestamp(new Date(invite.guild!.createdAt).toISOString());

    if (invite.guild?.description) {
      embed.setDescription(invite.guild?.description);
    }

    if (invite.inviter) {
      embed.addField(
        ctx.t('inviteInviter'),
        `${invite.inviter.username}#${invite.inviter.discriminator} (ID: ${invite.inviter.id})`,
      );
    }

    await ctx.reply({ embeds: [embed] });
  }

  private getInviteCodeFromURL(url: string): string {
    return url.matchAll(this.inviteRegex).next().value?.[1] ?? url;
  }
}
