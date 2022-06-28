import { Manager } from 'erela.js';
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from "zeolitecore";

export default class PauseCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'pause',
      description: 'Pauses the current track',
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

    if (player.paused) {
      await ctx.reply({ content: ctx.t('alreadyPaused'), flags: 64 });
      return;
    }

    player.pause(true);

    await ctx.reply(ctx.t('paused'));
  }
}
