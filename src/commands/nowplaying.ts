import { Manager } from 'erela.js';
import ZeoliteCommand from '../core/ZeoliteCommand';
import ZeoliteContext from '../core/ZeoliteContext';
import Utils from '../utils/Utils';
import Embed from '../core/Embed';
import ZeoliteClient from '../core/ZeoliteClient';

export default class NowPlayingCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'nowplaying',
      description: 'Shows the currently playing track',
      group: 'music',
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    if (
      !ctx.member!.voiceState.channelID ||
      ctx.member!.voiceState.channelID != ctx.guild!.members.get(this.client.user.id)?.voiceState.channelID
    ) {
      await ctx.reply({
        content: ctx.t('playNotInVoiceChannel'),
        flags: 64,
      });
      return;
    }

    const manager: Manager = ctx.get('manager');
    const player = manager.players.get(ctx.guild!.id);
    if (!player) {
      await ctx.reply({ content: ctx.t('notPlaying'), flags: 64 });
      return;
    }

    const track = player.queue.current;

    const trackDuration = Utils.parseTime(Math.floor(track!.duration! / 1000));
    const playerPos = Utils.parseTime(Math.floor(player.position / 1000));

    const embed = new Embed()
      .setTitle(ctx.t('nowPlaying'))
      .setDescription(`[${track?.title}](${track?.uri})`)
      .setThumbnail(track?.thumbnail as string)
      .addField(ctx.t('duration'), `${playerPos} / ${trackDuration}`)
      .setColor(ctx.get('embColor'))
      .setFooter({ text: ctx.t('playAuthor', track?.author) });

    await ctx.reply({ embeds: [embed] });
  }
}
