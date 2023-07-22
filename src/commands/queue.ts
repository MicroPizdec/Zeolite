import { Manager } from 'erela.js';
import {
  ZeoliteClient,
  ZeoliteCommand,
  ZeoliteContext,
  Embed,
  ActionRow,
  ZeoliteInteractionCollector,
} from 'zeolitecore';
import Utils from '../utils/Utils';
import { ComponentInteraction, User } from 'oceanic.js';

export default class QueueCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'queue',
      description: 'Shows the track queue',
      group: 'music',
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const manager: Manager = ctx.get('manager');
    const player = manager.players.get(ctx.guild!.id);
    if (!player) {
      await ctx.reply({ content: ctx.t('notPlaying'), flags: 64 });
      return;
    }

    if (!player.queue.size) {
      await ctx.reply({ content: ctx.t('queueEmpty'), flags: 64 });
      return;
    }

    const embed = new Embed().setTitle(ctx.t('queue')).setColor(ctx.get('embColor'));

    const fields: { name: string; value: string }[] = [];
    let index = 0;
    for (const track of player.queue) {
      fields.push({
        name: `${++index}: ${track.title}`,
        value: ctx.t(
          'durationRequestedBy',
          Utils.parseTime(Math.floor(track.duration! / 1000)),
          Utils.getUserTag(track.requester as User),
        ),
      });
    }

    if (player.queue.size > 10) {
      const pages: { name: string; value: string }[][] = [];

      while (fields.length) {
        const arr: { name: string; value: string }[] = [];
        for (const field of fields.splice(0, 10)) {
          arr.push(field);
        }
        pages.push(arr);
      }

      let pageNum = 0;
      embed.addFields(pages[pageNum]);
      embed.setFooter({
        text: ctx.t('queueFooter', pageNum + 1, pages.length),
      });

      const actionRow = new ActionRow(
        {
          type: 2,
          label: ctx.t('back'),
          customID: 'back',
          style: 1,
        },
        {
          type: 2,
          label: ctx.t('forward'),
          customID: 'forward',
          style: 1,
        },
        {
          type: 2,
          label: ctx.t('close'),
          customID: 'close',
          style: 4,
        },
      );

      await ctx.reply({ embeds: [embed], components: [actionRow] });

      const collector = new ZeoliteInteractionCollector(this.client, {
        message: await ctx.interaction.getOriginal(),
        filter: (i) => (i.member || i.user!).id == ctx.user.id,
        time: 600000,
      });

      collector.on('collect', (interaction: ComponentInteraction) => {
        switch (interaction.data.customID) {
          case 'back': {
            if (pageNum == 0) return;
            pageNum--;
            break;
          }
          case 'forward': {
            if (pageNum == pages.length - 1) return;
            pageNum++;
            break;
          }
          case 'close': {
            collector.stop();
            ctx.deleteReply();
            break;
          }
        }

        embed.spliceFields(0, 10, ...pages[pageNum]);
        embed.setFooter({
          text: ctx.t('queueFooter', pageNum + 1, pages.length),
        });
        interaction.editParent({ embeds: [embed] });
      });
    } else {
      embed.addFields(fields);
      await ctx.reply({ embeds: [embed] });
    }
  }
}
