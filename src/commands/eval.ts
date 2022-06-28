import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from "zeolitecore";
import util from 'util';

export default class EvalCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'eval',
      description: 'Executes provided code. Owner only.',
      group: 'dev',
      options: [
        {
          type: 3,
          name: 'code',
          description: 'Code',
          required: true,
        },
        {
          type: 5,
          name: 'silent',
          description: 'Respond with an ephemeral message',
          required: false,
        },
      ],
      ownerOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const silent = ctx.options.getBoolean('silent') || false;

    await ctx.defer(silent ? 64 : undefined);

    const code = ctx.options.getString('code')!;

    const asyncified = `(async () => {\n${code}\n})()`;

    try {
      let result: any = await eval(asyncified);
      if (typeof result != 'string') {
        result = util.inspect(result);
      }

      await ctx.editReply({ content: `\`\`\`js\n${result}\n\`\`\`` });
    } catch (error: any) {
      await ctx.editReply({ content: `\`\`\`js\n${error}\n\`\`\`` });
    }
  }
}
