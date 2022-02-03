import { MessageEmbed } from "discord.js";
import { Manager } from "erela.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Utils from "../utils/Utils";

export default class NowPlayingCommand extends ZeoliteCommand {
  name = "nowplaying";
  description = "Shows the currently playing track";
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

    const track = player.queue.current;

    const trackDuration = Utils.parseTime(Math.floor(track!.duration! / 1000)); 
    const playerPos = Utils.parseTime(Math.floor(player.position / 1000));

    const embed = new MessageEmbed()
      .setTitle(ctx.t("nowPlaying"))
      .setDescription(`[${track?.title}](${track?.uri})`)
      .setThumbnail(track?.thumbnail as string)
      .addField(ctx.t("duration"), `${playerPos} / ${trackDuration}`)
      .setColor(ctx.get("embColor"))
      .setFooter({ text: ctx.t("playAuthor", track?.author) });
    
    await ctx.reply({ embeds: [ embed ] });
  }
}