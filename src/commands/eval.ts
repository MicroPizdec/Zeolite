import ZeoliteCommand from "../core/ZeoliteCommand";
import util from "util";
import ZeoliteContext from "../core/ZeoliteContext";

export default class EvalCommand extends ZeoliteCommand {
  name = "eval";
  description = "Executes provided code. Owner only.";
  options = [
    {
      type: 3,
      name: "code",
      description: "Code",
      required: true,
    },
  ];
  ownerOnly = true;

  async run(ctx: ZeoliteContext) {
    await ctx.deferReply();

    const code = ctx.interaction.options.getString("code");
    const asyncified = `(async () => {\n${code}\n})()`;

    try {
      let result: any = await eval(asyncified);
      if (typeof result != "string") {
        result = util.inspect(result);
      }

      await ctx.editReply({ content: `\`\`\`js\n${result}\n\`\`\`` });
    } catch (error: any) {
      await ctx.editReply({ content: `\`\`\`js\n${error}\n\`\`\`` });
    }
  }
}