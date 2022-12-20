import { Manager } from 'erela.js';
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';

export default class VolumeCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'volume',
      description: 'Бесполезно',
      group: 'music',
      options: [
        {
          type: 1,
          name: 'get',
          description: 'Shows volume percentage',
        },
        {
          type: 1,
          name: 'set',
          description: 'Sets the music volume',
          options: [
            {
              type: 4,
              name: 'volume',
              description: 'Volume percentage',
              required: true,
              //minValue: 1,
              //maxValue: 200,
            },
          ],
        },
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubCommand()!;

    const manager: Manager = ctx.get('manager');
    const player = manager.players.get(ctx.guild!.id);

    switch (subcommand[0]) {
      case 'get': {
        if (!player) {
          await ctx.reply({ content: ctx.t('notPlaying'), flags: 64 });
          return;
        }

        const embed = new Embed()
          .setTitle(ctx.t('currentVolume', player.volume))
          .setColor(ctx.get('embColor'))
          .setFooter({ text: ctx.t('volumeFooter') });

        await ctx.reply({ embeds: [embed] });
        break;
      }

      case 'set': {
        if (!player) {
          await ctx.reply({ content: ctx.t('notPlaying'), flags: 64 });
          return;
        }

        const volumeNumber = ctx.options.getInteger('volume')!;

        player.setVolume(volumeNumber);

        await ctx.reply({ content: ctx.t('volumeChanged', volumeNumber) });
        break;
      }
    }
  }
}
