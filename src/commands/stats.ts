import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import os from "os";

function parseUptime(time: number): string {
  const obj = new Date(time);

  let days = obj.getUTCDate() - 1;
  let hours: string | number = obj.getUTCHours();
  let minutes: string | number = obj.getUTCMinutes();
  let seconds: string | number = obj.getUTCSeconds();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return `${days}:${hours}:${minutes}:${seconds}`;
}

export default class StatsCommand extends ZeoliteCommand {
  name = "stats";
  description = "Shows bot stats";
  group = "general";

  async run(ctx: ZeoliteContext) {
    const ramUsed = process.memoryUsage().heapUsed / 1048576;
    const cpu = os.cpus()[0];

    const embed = new MessageEmbed()
      .setTitle(ctx.t("stats"))
      .setColor(ctx.get("embColor"))
      .addField(ctx.t("statsUptime"), parseUptime(this.client.uptime as number), true)
      .addField(ctx.t("statsRamUsed"), `${ramUsed.toFixed(1)} MB`, true)
      .addField(ctx.t("statsPing"), `${this.client.ws.ping} ms`, true)
      .addField(ctx.t("statsServers"), this.client.guilds.cache.size.toString(), true)
      .addField(ctx.t("statsUsers"), this.client.users.cache.size.toString(), true)
      .addField(ctx.t("statsChannels"), this.client.channels.cache.size.toString(), true)
      .addField(ctx.t("statsCommandsUsed"), commandsUsed.toString(), true)
      .addField(ctx.t("statsCpu"), `\`${cpu ? cpu.model : ctx.t("unableToGetCpuInfo")}\``)
      .setFooter({ text: `Zeolite v${process.env.npm_package_version} © Fishyrene`, iconURL: this.client.user?.displayAvatarURL() });
    
    await ctx.reply({ embeds: [ embed ] });
  }
}