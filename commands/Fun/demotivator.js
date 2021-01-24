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
    const isWhite = args[0] == "-w";
    if (isWhite) args.shift(); 
    const [ text, bottomText, imageLink ] = args;

    if (!bottomText) {
      return msg.channel.createMessage(t(lang, "DEMOTIVATOR_NO_BOTTOM_TEXT"));
    }
    if (!msg.attachments.length && !imageLink) {
      return msg.channel.createMessage(t(lang, "DEMOTIVATOR_NO_IMAGE"));
    }

    const message = await msg.channel.createMessage("<a:d_typing:791621737880092700>");

    const image = await Canvas.loadImage(msg.attachments[0]?.url || imageLink);

    const canvas = Canvas.createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = isWhite ? "white" : "black";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = isWhite ? "black" : "white";
    ctx.fillRect(92, 40, 840, 770);
    ctx.fillStyle = isWhite ? "white" : "black";
    ctx.fillRect(97, 45, 830, 760);

    ctx.drawImage(image, 102, 50, 820, 750);

    ctx.fillStyle = isWhite ? "black" : "white";
    ctx.font = "96px Times New Roman";
    ctx.textAlign = "center";
    ctx.fillText(text, 512, 920, 900);

    ctx.font = "36px Arial";
    ctx.fillText(bottomText, 512, 975, 900);

    const buffer = canvas.toBuffer();

    await message.delete();
    await msg.channel.createMessage("", { name: "demotivator.png", file: buffer });
  }
}