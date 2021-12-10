import { CommandInteraction, MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";

export default class TestCommand extends ZeoliteCommand {
  name = "test";
  description = "Test command";

  async run(ctx: CommandInteraction) {
    const embed = new MessageEmbed()
      .setTitle("Работаем...")
      .setDescription("на TypeScript епта)")
    
    await ctx.reply({ embeds: [ embed ] });
  }
}