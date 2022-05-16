import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import { exec } from "child_process";

export default class ExecCommand extends ZeoliteCommand {
  name = "exec";
  description = "Don't touch this";
  group = "dev";
  options = [
    {
      type: 3,
      name: "code",
      description: "Shell code",
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
    const ephemeral = ctx.options.getBoolean("silent") || false;

    await ctx.deferReply({ ephemeral });

    const code = ctx.options.getString("code", true);

    exec(code, (err, stdout, stderr) => {
      if (err) {
        ctx.editReply(`\`\`\`${err}\`\`\``);
        return;
      }
      ctx.editReply(`Stdout:\n\`\`\`${stdout || "Empty"}\`\`\`\n\nStderr:\n\`\`\`${stderr || "Empty"}\`\`\``);
    })
  }
}