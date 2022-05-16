import { Invite, MessageEmbed } from "discord.js-light";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class InviteCommand extends ZeoliteCommand {
  name = "invite";
  description = "Shows information about provided invite";
  group = "general";
  options = [
    {
      type: 3,
      name: "invite",
      description: "Invite code or URL",
      required: true,
    },
  ];

  async run(ctx: ZeoliteContext) {
    const url = ctx.options.getString("invite", true);

    let invite: Invite | undefined;
    try {
      invite = await this.client.fetchInvite(url);
    } catch {
      await ctx.reply({ content: ctx.t("invalidInvite"), ephemeral: true });
      return;
    }

    const embed = new MessageEmbed()
      .setTitle(invite.guild!.name)
      .setThumbnail(invite.guild?.iconURL()!)
      .setColor(ctx.get("embColor"))
      .addField(ctx.t("serverMembers"), ctx.t("inviteMembersCount", invite.memberCount, invite.presenceCount))
      .addField(ctx.t("serverVerificationLevel"), ctx.t(invite.guild!.verificationLevel))
      .addField("ID", invite.guild!.id)
      .addField(ctx.t("inviteChannel"), `#${invite.channel.name} (ID: ${invite.channelId})`)
      .setFooter({ text: ctx.t("inviteFooter") })
      .setTimestamp(invite.guild!.createdAt);

    if (invite.guild?.description) {
      embed.setDescription(invite.guild?.description);
    }

    if (invite.inviter) {
      embed.addField(ctx.t("inviteInviter"), `${invite.inviter.tag} (ID: ${invite.inviter.id})`);
    }

    await ctx.reply({ embeds: [ embed ] });
  }
}