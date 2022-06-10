import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import { exec } from "child_process";
import ZeoliteClient from "../core/ZeoliteClient";

export default class ExecCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: "exec",
      description: "Don't touch this",
      group: "dev",
      options: [
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
      ],
      ownerOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const ephemeral = ctx.options.getBoolean("silent") || false;

    await ctx.defer(ephemeral ? 64 : undefined);

    const code = ctx.options.getString("code")!;

    exec(code, (err, stdout, stderr) => {
      if (err) {
        ctx.editReply(`\`\`\`${err}\`\`\``);
        return;
      }
      ctx.editReply(`Stdout:\n\`\`\`${stdout || "Empty"}\`\`\`\n\nStderr:\n\`\`\`${stderr || "Empty"}\`\`\``);
    })
  }
}