import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import axios from 'axios';

export default class UrbanCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'urban',
      description: 'Searches the definition by provided word in Urban Dictionary',
      group: 'other',
      options: [
        {
          type: 3,
          name: 'word',
          description: 'A word',
          required: true,
        },
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    await ctx.defer();

    const word = ctx.options.getString('word')!;

    const params = new URLSearchParams();
    params.append('term', word);

    let response: any;
    try {
      response = await axios.get(`http://api.urbandictionary.com/v0/define?${params}`).then((r) => r.data);
    } catch {
      await ctx.editReply({ content: ctx.t('urbanSomethingWentWrong') });
      return;
    }

    const data = response.list[0];

    if (!data) {
      await ctx.editReply({ content: ctx.t('urbanWordNotFound') });
      return;
    }

    if (!data.definition?.length || data.definition.length > 3920 || data.example.length > 1000) {
      await ctx.editReply({ content: ctx.t('urbanCantShowDefinition', data.permalink) });
      return;
    }
    const embed = new Embed()
      .setTitle(data.word)
      .setDescription(data.definition)
      .setColor(ctx.get('embColor'))
      .setURL(data.permalink)
      .addField(ctx.t('urbanRating'), `${data.thumbs_up} :thumbsup:\n${data.thumbs_down} :thumbsdown:`)
      .setFooter({ text: ctx.t('urbanAuthor', data.author) });

    if (data.example) {
      embed.addField(ctx.t('urbanExample'), data.example);
    }

    await ctx.editReply({ embeds: [embed] });
  }
}
