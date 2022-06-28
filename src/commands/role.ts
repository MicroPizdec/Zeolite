import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import Utils from '../utils/Utils';

export default class RoleCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'role',
      description: 'Information about role',
      group: 'general',
      options: [
        {
          type: 8,
          name: 'role',
          description: 'A role',
          required: true,
        },
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    const role = ctx.options.getRole('role')!;

    const createdDays = Math.floor((Date.now() - role.createdAt) / (86400 * 1000));

    const embed = new Embed()
      .setTitle(role.name)
      .setColor(role.color || ctx.get('embColor'))
      .addField('ID', role.id)
      .addField(ctx.t('roleCreatedAt'), `<t:${Math.floor(role.createdAt / 1000)}> ${ctx.t('daysAgo', createdDays)}`)
      .addField(ctx.t('roleHoisted'), role.hoist ? ctx.t('payYes') : ctx.t('payNo'))
      .addField(ctx.t('roleManaged'), role.managed ? ctx.t('payYes') : ctx.t('payNo'))
      .addField(ctx.t('roleColor'), role.color ? `#${Utils.intToHex(role.color)}` : ctx.t('roleColorDefault'))
      .setFooter({
        text: 'Zeolite © Fishyrene',
        icon_url: this.client.user.avatarURL,
      }); // ВЫ НЕ ПОНИМАЕТЕ ЭТО ДРУГОЕ

    await ctx.reply({ embeds: [embed] });
  }
}
