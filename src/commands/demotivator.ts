import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import * as Canvas from "canvas";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";

Canvas.registerFont("./assets/arial.ttf", { family: "Arial" });
Canvas.registerFont("./assets/times.ttf", { family: "Times New Roman" });

export default class DemotivatorCommand extends ZeoliteCommand {
  name = "demotivator";
  description = "Creates a demotivator from provided text and image";
  options = [
    {
      type: 3,
      name: "text",
      description: "Upper text",
      required: true,
    },
    {
      type: 3,
      name: "bottomtext",
      description: "Bottom text",
      required: true,
    },
    {
      type: 3,
      name: "imageurl",
      description: "Image URL",
      required: true,
    },
    {
      type: 5,
      name: "white",
      description: "Should the white demotivator be created",
      required: false,
    },
  ];

  async run(ctx: ZeoliteContext) {
    const text = ctx.interaction.options.getString("text") as string;
    const bottomText = ctx.interaction.options.getString("bottomtext");
    const imageURL = ctx.interaction.options.getString("imageurl") as string;
    const isWhite = ctx.interaction.options.getBoolean("white") || false;

    await ctx.deferReply();

    let image: Canvas.Image | undefined;
    try {
      image = await Canvas.loadImage(imageURL);
    } catch {
      await ctx.editReply({ content: ctx.t("demotivatorInvalidURL") });
      return;
    }

    const canvas = Canvas.createCanvas(1024, 1024);
    const cCtx = canvas.getContext("2d");

    cCtx.fillStyle = isWhite ? "white" : "black";
    cCtx.fillRect(0, 0, 1024, 1024);
    cCtx.fillStyle = isWhite ? "black" : "white";
    cCtx.fillRect(72, 40, 880, 790);
    cCtx.fillStyle = isWhite ? "white" : "black";
    cCtx.fillRect(77, 45, 870, 780);

    cCtx.drawImage(image, 82, 50, 860, 770);

    cCtx.fillStyle = isWhite ? "black" : "white";
    cCtx.font = "96px Times New Roman";
    cCtx.textAlign = "center";
    cCtx.fillText(text, 512, 920, 900);

    cCtx.font = "36px Arial";
    cCtx.fillText(bottomText || "", 512, 975, 900);

    const buffer = canvas.toBuffer();

    await ctx.editReply({ files: [ new MessageAttachment(buffer, "demotivator.png") ] });
  }
}