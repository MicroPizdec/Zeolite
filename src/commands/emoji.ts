import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed, ActionRow } from 'zeolitecore';

export default class EmojiCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'emoji',
      description: 'Shows info about emoji',
      group: 'other',
      options: [
        {
          type: 3,
          name: 'emoji',
          description: 'Server emoji. Built-in Discord emojis are not supported',
          required: true,
        },
      ],
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const emoji = ctx.options.getString('emoji')!;

    if (!/<a:.+?:\d+>|<:.+?:\d+>/g.test(emoji)) {
      await ctx.reply({ content: ctx.t('emojiNotFound'), flags: 64 });
      return;
    }

    const id = emoji.match(/(?<=:)\d+/g)![0];
    const name = emoji.match(/:\w+?:/)![0];
    const isAnimated = /<a/.test(emoji);

    const url = `https://cdn.discordapp.com/emojis/${id}.${isAnimated ? 'gif' : 'png'}?v=1`;

    const embed = new Embed()
      .setTitle(name)
      .setThumbnail(url)
      .setColor(ctx.get('embColor'))
      .addField('ID', id)
      .addField(ctx.t('emojiAnimated'), isAnimated ? ctx.t('payYes') : ctx.t('payNo'));

    const actionRow = new ActionRow({
      type: 2,
      label: ctx.t('emojiLink'),
      style: 5,
      url,
    });

    await ctx.reply({ embeds: [embed], components: [actionRow] });
  }
}
