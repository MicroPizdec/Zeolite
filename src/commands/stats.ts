import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import os from "os";
import Embed from "../core/Embed";
import ZeoliteClient from "../core/ZeoliteClient";

export default class StatsCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: "stats",
      description: "Shows bot stats",
    });
  }
  
  public async run(ctx: ZeoliteContext) {
    const ramUsed = process.memoryUsage().heapUsed / 1048576;
    const cpu = os.cpus()[0];

    const embed = new Embed()
      .setTitle(ctx.t("stats"))
      .setColor(ctx.get("embColor"))
      .addField(ctx.t("statsUptime"), this.parseUptime(this.client.uptime), true)
      .addField(ctx.t("statsRamUsed"), `${ramUsed.toFixed(1)} MB`, true)
      .addField(ctx.t("statsPing"), `${(ctx.guild?.shard || this.client.shards.get(0)!).latency} ms`, true)
      .addField(ctx.t("statsServers"), this.client.guilds.size.toString(), true)
      .addField(ctx.t("statsUsers"), this.client.users.size.toString(), true)
      .addField(ctx.t("statsChannels"), Object.keys(this.client.channelGuildMap).length.toString(), true)
      .addField(ctx.t("statsCommandsUsed"), commandsUsed.toString(), true)
      .addField(ctx.t("statsPlatform"), `${this.getPlatform()} ${os.release()}`)
      .addField(ctx.t("statsCpu"), `\`${cpu ? cpu.model : ctx.t("unableToGetCpuInfo")}\``)
      .setFooter({ text: `Zeolite v${process.env.npm_package_version} © Fishyrene`, icon_url: this.client.user.avatarURL });

    await ctx.reply({ embeds: [ embed ] });
  }

  private parseUptime(time: number): string {
    const obj = new Date(time);
  
    let days = obj.getUTCDate() - 1;
    let hours = obj.getUTCHours().toString().padStart(2, "0");
    let minutes = obj.getUTCMinutes().toString().padStart(2, "0");
    let seconds = obj.getUTCSeconds().toString().padStart(2, "0");
  
    return `${days}:${hours}:${minutes}:${seconds}`;
  }

  private getPlatform(): string {
    switch (process.platform) {
      case "win32": return "<:windows:965193618224734268> Windows";
      case "linux": return "<:linux:965193670531899403> Linux";
      case "android": return "<:android:965193699761979413> Android";
      default: return process.platform;
    }
  }
}