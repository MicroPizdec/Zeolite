import { Manager } from 'erela.js';
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from "zeolitecore";

export default class LoopCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'loop',
      description: 'Toggles looping for the currently playing track',
      guildOnly: true,
      group: 'music',
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

    player.setTrackRepeat(!player.trackRepeat);

    await ctx.reply(player.trackRepeat ? ctx.t('loopEnabled') : ctx.t('loopDisabled'));
  }
}
