import { Manager } from "erela.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class PauseCommand extends ZeoliteCommand {
  name = "pause";
  description = "Pauses the current track";
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    if (!ctx.member.voice.channel || ctx.member.voice.channelId != ctx.guild!.me?.voice.channelId) {
      await ctx.reply({ content: ctx.t("playNotInVoiceChannel"), ephemeral: true });
      return;
    }

    const manager: Manager = ctx.get("manager");
    const player = manager.players.get(ctx.guild!.id);
    if (!player) {
      await ctx.reply({ content: ctx.t("notPlaying"), ephemeral: true })
      return;
    }

    if (player.paused) {
      await ctx.reply({ content: ctx.t("alreadyPaused"), ephemeral: true })
      return;
    }

    player.pause(true);

    await ctx.reply(ctx.t("paused"));
  }
}