import { MessageEmbed } from "discord.js-light";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class TestCommand extends ZeoliteCommand {
  name = "test";
  description = "Test command";

  async run(ctx: ZeoliteContext) {
    const embed = new MessageEmbed()
      .setTitle(ctx.t("testString"))
      .setDescription(ctx.t("testStringWithError"));
    
    await ctx.reply({ embeds: [ embed ] });
  }
}