import * as QRCode from "qrcode";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import { MessageEmbed, MessageAttachment } from "discord.js";

export default class QrCommand extends ZeoliteCommand {
  name = "qr";
  description = "Creates a QR code";
  group = "other";
  options = [
    {
      type: 3,
      name: "text",
      description: "Text",
      required: true,
    },
  ];

  async run (ctx: ZeoliteContext) {
    const text = ctx.options.getString("text", true);

    await ctx.deferReply();
    
    const startTime = Date.now()
    const qr = await QRCode.toDataURL(text)
      .then(q => q.replace("data:image/png;base64,", ""));
    const finishTime = Date.now() - startTime;
    
    const embed = new MessageEmbed()
      .setColor(ctx.get("embColor"))
      .setImage("attachment://qr.png")
      .setFooter({ text: ctx.t("generationTime", finishTime) })

    await ctx.editReply({
      embeds: [ embed ],
      files: [ new MessageAttachment(Buffer.from(qr, "base64"), "qr.png") ]
    });
  }
}