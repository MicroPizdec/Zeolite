import { Manager } from "erela.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class PlayCommand extends ZeoliteCommand {
  name = "play";
  description = "Plays a track in voice channel";
  group = "music";
  options = [
    {
      type: 3,
      name: "track",
      description: "Track name or URL",
      required: true,
    },
  ];
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    if (!ctx.member.voice.channel) {
      await ctx.reply({ content: ctx.t("playNotInVoiceChannel"), ephemeral: true });
      return;
    }

    const query = ctx.options.getString("track", true);
    const manager: Manager = ctx.get("manager");

    const res = await manager.search(query, ctx.user);
    if (res.loadType == "LOAD_FAILED") {
      await ctx.reply({ content: ctx.t("playLoadFail", res.exception?.message), ephemeral: true });
      return;
    } else if (res.loadType == "PLAYLIST_LOADED") {
      await ctx.reply({ content: ctx.t("playPlaylistIsNotSupported"), ephemeral: true });
      return;
    }

    const track = res.tracks[0];
    if (!track) {
      await ctx.reply({ content: ctx.t("playTrackNotFound"), ephemeral: true });
    }

    const player = manager.create({
      guild: ctx.guild!.id,
      voiceChannel: ctx.member.voice.channelId as string | undefined,
      textChannel: ctx.channel!.id,
    });

    player.queue.add(track);

    if (!player.get("lang")) player.set("lang", this.client.localization.languageStrings[this.client.localization.userLanguages[ctx.user.id] as string]);

    if (!player.playing && !player.paused && !player.queue.size) {
      player.connect();
      player.play();
    }

    await ctx.reply({ content: ctx.t("playAddedToQueue", track.title) });
  }
} 