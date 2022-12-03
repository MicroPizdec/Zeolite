import { Manager } from 'erela.js';
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from 'zeolitecore';

export default class PlayCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'play',
      description: 'Plays a track in voice channel',
      group: 'music',
      options: [
        {
          type: 3,
          name: 'track',
          description: 'Track name or URL',
          required: true,
        },
      ],
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    if (!ctx.member?.voiceState?.channelID) {
      await ctx.reply({
        content: ctx.t('playNotInVoiceChannel'),
        flags: 64,
      });
      return;
    }

    await ctx.defer();

    const query = ctx.options.getString('track')!;
    const manager: Manager = ctx.get('manager');

    const res = await manager.search(query, ctx.user);
    if (res.loadType == 'LOAD_FAILED') {
      await ctx.editReply({
        content: ctx.t('playLoadFail', res.exception?.message),
      });
      return;
    } else if (res.loadType == 'PLAYLIST_LOADED') {
      await ctx.editReply({
        content: ctx.t('playPlaylistIsNotSupported'),
      });
      return;
    }

    const track = res.tracks[0];
    if (!track) {
      await ctx.editReply({ content: ctx.t('playTrackNotFound') });
    }

    const player = manager.create({
      guild: ctx.guild!.id,
      voiceChannel: ctx.member.voiceState.channelID,
      textChannel: ctx.channel!.id,
    });

    player.queue.add(track);

    if (!player.get('lang'))
      player.set(
        'lang',
        this.client.localizationManager.languageStrings[this.client.localizationManager.userLanguages[ctx.user.id] as string],
      );

    if (!player.playing && !player.paused && !player.queue.size) {
      player.connect();
      player.play();
    }

    await ctx.editReply({ content: ctx.t('playAddedToQueue', track.title) });
  }
}
