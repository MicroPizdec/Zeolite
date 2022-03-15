import { TextChannel } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class PurgeCommand extends ZeoliteCommand {
  name = "purge";
  description = "Cleans the specified amount of messages in channel. Requires Manage Messages permission";
  group = "moderation";
  options = [
    {
      type: 4,
      name: "amount",
      description: "Amount of messages to clean (1-100)",
      required: true,
      minValue: 1,
      maxValue: 100,
    },
  ]
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const channel = ctx.channel as TextChannel;
    if (!channel.permissionsFor(ctx.guild!.me!).has("MANAGE_MESSAGES")) {
      await ctx.reply({ content: ctx.t("purgeNoBotPerms"), ephemeral: true });
      return;
    }

    if (!channel.permissionsFor(ctx.member).has("MANAGE_MESSAGES")) {
      this.client.emit("noPermissions", ctx, [ "MANAGE_MESSAGES" ]);
      return;
    }

    const amount = ctx.options.getInteger("amount", true);
    await channel.bulkDelete(amount);
    await ctx.reply(ctx.t("purgeSuccess", amount));
  }
}