import { TextChannel } from 'oceanic.js';
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from 'zeolitecore';

export default class PurgeCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'purge',
      description: 'Cleans the specified amount of messages in channel. Requires Manage Messages permission',
      group: 'moderation',
      options: [
        {
          type: 4,
          name: 'amount',
          description: 'Amount of messages to clean (1-100)',
          required: true,
          // fuck eris types
          // min_value: 1,
          // max_value: 100,
        },
      ],
      guildOnly: true,
      requiredPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async run(ctx: ZeoliteContext) {
    const channel = ctx.channel as TextChannel;
    if (!channel.permissionsOf(ctx.guild!.members.get(this.client.user.id)!).has('MANAGE_MESSAGES')) {
      await ctx.reply({ content: ctx.t('purgeNoBotPerms'), flags: 64 });
      return;
    }

    if (!channel.permissionsOf(ctx.member!).has('MANAGE_MESSAGES')) {
      this.client.emit('noPermissions', ctx, ['MANAGE_MESSAGES']);
      return;
    }

    const amount = ctx.options.getInteger('amount')!;

    if (amount < 1 || amount > 100) {
      await ctx.reply({ content: ctx.t('purgeOutOfRange'), flags: 64 });
      return;
    }

    await channel.purge({ limit: amount });
    await ctx.reply({ content: ctx.t('purgeSuccess', amount) });
  }
}
