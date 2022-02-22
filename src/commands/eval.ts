import ZeoliteCommand from "../core/ZeoliteCommand";
import util from "util";
import ZeoliteContext from "../core/ZeoliteContext";

export default class EvalCommand extends ZeoliteCommand {
  name = "eval";
  description = "Executes provided code. Owner only.";
  group = "dev";
  options = [
    {
      type: 3,
      name: "code",
      description: "Code",
      required: true,
    },
    {
      type: 5,
      name: "silent",
      description: "Respond with an ephemeral message",
      required: false,
    },
  ];
  ownerOnly = true;

  async run(ctx: ZeoliteContext) {
    const silent = ctx.options.getBoolean("silent") || false;

    await ctx.deferReply({ ephemeral: silent });

    const code = ctx.options.getString("code", true);

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
