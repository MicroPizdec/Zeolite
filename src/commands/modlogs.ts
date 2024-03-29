import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import Modlogs from '../dbModels/Modlogs';
import ModlogsExtension from '../extensions/modlogs';

export default class ModlogsCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'modlogs',
      description: 'Modlogs command',
      group: 'settings',
      options: [
        {
          type: 1,
          name: 'get',
          description: 'Shows current modlogs channel. Requires Manage Server permission.',
        },
        {
          type: 1,
          name: 'set',
          description: 'Sets modlogs channel. Requires Manage Server permission.',
          options: [
            {
              type: 7,
              name: 'channel',
              description: 'A channel',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'disable',
          description: 'Disables modlogs. Requires Manage Server permission.',
        },
      ],
      guildOnly: true,
      requiredPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(ctx: ZeoliteContext) {
    const modlogs = await Modlogs.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((m) => m[0]);

    switch (ctx.options.getSubCommand()![0]) {
      case 'get': {
        const embed = new Embed()
          .setDescription(modlogs.channelID ? ctx.t('modlogsEnabled', modlogs.channelID) : ctx.t('modlogsDisabled'))
          .setColor(ctx.get('embColor'))
          .setFooter({ text: ctx.t('modlogsFooter') });

        await ctx.reply({ embeds: [embed], flags: 64 });
        break;
      }

      case 'set': {
        const channel = ctx.options.getChannel('channel');

        if (channel?.type != 0) {
          await ctx.reply({
            content: ctx.t('modlogsNonTextChannel'),
            flags: 64,
          });
          return;
        }

        const botMember = ctx.guild!.members.get(this.client.user.id)!;
        const botPerms = ctx.guild?.channels.get(channel.id)?.permissionsOf(botMember);
        if (!botPerms?.has('SEND_MESSAGES') || !botPerms?.has('EMBED_LINKS')) {
          await ctx.reply({
            content: ctx.t('modlogsNoPermsForBot'),
            flags: 64,
          });
          return;
        }

        await modlogs.update({ channelID: channel.id });
        (this.client.extensionsManager.extensions.get('modlogs') as ModlogsExtension).channelsCache[ctx.guild?.id!] =
          channel.id;
        await ctx.reply({
          content: ctx.t('modlogsSuccess', `<#${channel.id}>`),
        });
        break;
      }

      case 'disable': {
        await modlogs.destroy();
        delete (this.client.extensionsManager.extensions.get('modlogs') as ModlogsExtension).channelsCache[
          ctx.guild?.id!
        ];

        await ctx.reply({ content: ctx.t('modlogsDisableSuccess') });
        break;
      }
    }
  }
}
