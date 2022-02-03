import { Manager } from "erela.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class LoopCommand extends ZeoliteCommand {
  name = "loop";
  description = "Toggles looping for the currently playing track";
  guildOnly = true;
  group = "music";

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

    player.setTrackRepeat(!player.trackRepeat)

    await ctx.reply(player.trackRepeat ? ctx.t("loopEnabled") : ctx.t("loopDisabled"));
  }
}