import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import os from "os";

export default class StatsCommand extends ZeoliteCommand {
  name = "stats";
  description = "Shows bot stats";
  
  async run(ctx: ZeoliteContext) {
    const ramUsed = process.memoryUsage().heapUsed / 1048576;

    const embed = {
      title: "Stats",
      fields: [
        {
          name: "RAM used:",
          value: `${ramUsed.toFixed(1)} MB`,
        },
      ],
    };

    await ctx.reply({ embeds: [ embed ] });
  }
}