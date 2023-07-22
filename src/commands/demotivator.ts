import { ApplicationCommandOptionTypes } from 'oceanic.js';
import { Embed, ZeoliteClient, ZeoliteCommand, ZeoliteContext } from 'zeolitecore';
//import Canvas from 'canvas';

export default class DemotivatorCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'demotivator',
      description: 'Creates the demotivator from provided image and text',
      group: 'fun',
      options: [
        {
          type: ApplicationCommandOptionTypes.ATTACHMENT,
          name: 'image',
          description: 'An image',
          required: true,
        },
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: 'text',
          description: 'Top text',
          required: true,
        },
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: 'bottomtext',
          description: 'Bottom text',
          required: true,
        },
        {
          type: ApplicationCommandOptionTypes.BOOLEAN,
          name: 'white',
          description: 'Should the demotivator be white or not',
          required: false,
        },
      ],
    });

    //Canvas.registerFont('./assets/times.ttf', { family: 'Times New Roman' });
    //Canvas.registerFont('./assets/arial.ttf', { family: 'Arial' });
  }

  public preLoad(): boolean {
    return false;
  }

  public async run(ctx: ZeoliteContext) {
    /*const text = ctx.options.getString('text', true);
    const bottomText = ctx.options.getString('bottomtext', true);
    const attachment = ctx.options.getAttachment('image', true);
    const white = ctx.options.getBoolean('white') || false;

    if (!attachment.contentType?.startsWith('image')) {
      await ctx.reply({ content: ctx.t('demotivatorInvalidAttachment'), flags: 64 });
      return;
    }

    await ctx.defer();

    const startTime = Date.now();
    let image: Canvas.Image;
    try {
      image = await Canvas.loadImage(attachment.url);
    } catch {
      await ctx.reply({ content: ctx.t('demotivatorFailedToLoadImage') });
      return;
    }

    const canvas = Canvas.createCanvas(1024, 1024);
    const cCtx = canvas.getContext('2d');

    cCtx.fillStyle = white ? 'white' : 'black';
    cCtx.fillRect(0, 0, 1024, 1024);
    cCtx.fillStyle = white ? 'black' : 'white';
    cCtx.fillRect(72, 40, 880, 790);
    cCtx.fillStyle = white ? 'white' : 'black';
    cCtx.fillRect(77, 45, 870, 780);

    cCtx.drawImage(image, 82, 50, 860, 770);

    cCtx.fillStyle = white ? 'black' : 'white';
    cCtx.font = '96px Times New Roman';
    cCtx.textAlign = 'center';
    cCtx.fillText(text, 512, 920, 900);

    cCtx.font = '36px Arial';
    cCtx.fillText(bottomText, 512, 975, 900);

    const buffer = canvas.toBuffer();
    const finishTime = Date.now() - startTime;

    const embed = new Embed()
      .setImage('attachment://demotivator.png')
      .setColor(ctx.get('embColor'))
      .setFooter({ text: ctx.t('generationTime', finishTime) });

    await ctx.editReply({ embeds: [embed], files: [{ name: 'demotivator.png', contents: buffer }] });*/
  }
}
