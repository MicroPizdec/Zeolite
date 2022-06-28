import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from 'zeolitecore';

export default class EmbedCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'embed',
      description: 'Creates an embed from JSON',
      group: 'other',
      options: [
        {
          type: 3,
          name: 'json',
          description: 'A JSON string that represents the embed',
          required: true,
        },
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    const embedJson = ctx.options.getString('json')!;

    try {
      const embedObj = JSON.parse(embedJson);
      await ctx.reply({ embeds: [embedObj] });
    } catch {
      await ctx.reply({ content: ctx.t('embedInvalidJSON'), flags: 64 });
    }
  }
}
