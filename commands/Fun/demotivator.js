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
      return msg.reply(t(lang, "DEMOTIVATOR_NO_BOTTOM_TEXT"));
    }
    if (!msg.attachments.length && !imageLink) {
      return msg.reply(t(lang, "DEMOTIVATOR_NO_IMAGE"));
    }

    const message = await msg.reply("<a:d_typing:791621737880092700>");

    let image;
    try {
      image = await Canvas.loadImage(msg.attachments[0]?.url || imageLink);
    } catch {
      return message.edit(t(lang, "DEMOTIVATOR_IMAGE_FAILED"));
    }

    const canvas = Canvas.createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = isWhite ? "white" : "black";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = isWhite ? "black" : "white";
    ctx.fillRect(72, 40, 880, 790);
    ctx.fillStyle = isWhite ? "white" : "black";
    ctx.fillRect(77, 45, 870, 780);

    ctx.drawImage(image, 82, 50, 860, 770);

    ctx.fillStyle = isWhite ? "black" : "white";
    ctx.font = "96px Times New Roman";
    ctx.textAlign = "center";
    ctx.fillText(text, 512, 920, 900);

    ctx.font = "36px Arial";
    ctx.fillText(bottomText, 512, 975, 900);

    const buffer = canvas.toBuffer();

    await message.delete();
    await msg.reply("", { name: "demotivator.png", file: buffer });
  }
}