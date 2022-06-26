import ZeoliteClient from '../core/ZeoliteClient';
import ZeoliteCommand from '../core/ZeoliteCommand';
import ZeoliteContext from '../core/ZeoliteContext';
import Embed from '../core/Embed';
import { User } from 'eris';
import ActionRow from '../core/ActionRow';

export default class InfoCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'info',
      description: 'Information about bot',
      group: 'general',
    });
  }

  public async run(ctx: ZeoliteContext) {
    const link = this.client.generateInvite(8, ['bot', 'applications.commands']);

    const devIds: string[] = ['800053727988809748', '527725849575686145', '330153333962702850'];
    const devs: (User | undefined)[] = [];
    for (const id of devIds) {
      const user = this.client.users.has(id)
        ? this.client.users.get(id)
        : await this.client.getRESTUser(id).catch(() => {});

      if (user) devs.push(user);
    }

    const embed = new Embed()
      .setTitle(ctx.t('infoTitle'))
      .setDescription(ctx.t('infoDesc'))
      .setColor(ctx.get('embColor'))
      .addField(ctx.t('infoDevs'), devs.map((d) => `${d?.username}#${d?.discriminator}`).join(', '));

    const actionRow = new ActionRow(
      {
        type: 2,
        label: ctx.t('infoInvite'),
        style: 5,
        url: link,
      },
      {
        type: 2,
        label: ctx.t('infoSupportServer'),
        style: 5,
        url: 'https://discord.gg/ZKChwBD',
      },
      {
        type: 2,
        label: ctx.t('infoRepository'),
        style: 5,
        url: 'https://github.com/MicroPizdec/Zeolite',
      },
      {
        type: 2,
        label: ctx.t('infoDonate'),
        style: 5,
        url: 'https://www.donationalerts.com/r/fishyrene',
      },
    );

    await ctx.reply({ embeds: [embed], components: [actionRow] });
  }
}
