const Canvas = require("canvas");

Canvas.registerFont("./fonts/Times New Roman.ttf", { family: "Times New Roman" });
Canvas.registerFont("./fonts/Arial.ttf", { family: "Arial" });

module.exports = {
  name: "demotivator",
  group: "FUN_GROUP",
  description: "DEMOTIVATOR_DESCRIPTION",
  usage: "DEMOTIVATOR_USAGE",
  aliases: [ "dem" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    const [ text, bottomText, imageLink ] = args;

    if (!bottomText) {
      return msg.channel.createMessage(t(lang, "DEMOTIVATOR_NO_BOTTOM_TEXT"));
    }
    if (!msg.attachments.length && !imageLink) {
      return msg.channel.createMessage(t(lang, "DEMOTIVATOR_NO_IMAGE"));
    }

    const image = await Canvas.loadImage(msg.attachments[0]?.url || imageLink);

    const canvas = Canvas.createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = "white";
    ctx.fillRect(92, 40, 840, 770);
    ctx.fillStyle = "black";
    ctx.fillRect(97, 45, 830, 760);

    ctx.drawImage(image, 102, 50, 820, 750);

    ctx.fillStyle = "white";
    ctx.font = "96px Times New Roman";
    ctx.textAlign = "center";
    ctx.fillText(text, 512, 920, 900);

    ctx.font = "36px Arial";
    ctx.fillText(bottomText, 512, 975, 900);

    const buffer = canvas.toBuffer();

    await msg.channel.createMessage("", { name: "demotivator.png", file: buffer });
  }
}