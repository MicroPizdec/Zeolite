import QRCode from 'qrcode';
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';

export default class QrCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'qr',
      description: 'Creates a QR code',
      group: 'other',
      options: [
        {
          type: 3,
          name: 'text',
          description: 'Text',
          required: true,
        },
      ],
    });
  }

  async run(ctx: ZeoliteContext) {
    const text = ctx.options.getString('text')!;

    await ctx.defer();

    const startTime = Date.now();
    const qr = await QRCode.toDataURL(text).then((q) => q.replace('data:image/png;base64,', ''));
    const finishTime = Date.now() - startTime;

    const embed = new Embed()
      .setColor(ctx.get('embColor'))
      .setImage('attachment://qr.png')
      .setFooter({ text: ctx.t('generationTime', finishTime) });

    await ctx.editReply({ embeds: [embed], files: [{ name: "qr.png", contents: Buffer.from(qr, "base64") }] });
  }
}
