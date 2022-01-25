import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class TestCommand extends ZeoliteCommand {
  name = "test";
  description = "Test command";

  async run(ctx: ZeoliteContext) {
    await ctx.reply("гавно");
  }
}