import ZeoliteExtension from "../core/ZeoliteExtension";
import Logger, { LoggerLevel } from "../core/Logger";
import { Manager } from "erela.js";
import { MessageEmbed, TextBasedChannel } from "discord.js";
import util from "util";
import parseTime from "../utils/parseTime";

let self: MusicExtension;

export default class MusicExtension extends ZeoliteExtension {
  name = "music";
  manager: Manager;

  async onLoad() {
    self = this;

    if (!config.lavalinkNodes) return;

    const logger = new Logger(LoggerLevel.Info, "MusicExtension");

    this.manager = new Manager({
      nodes: config.lavalinkNodes,
      send(id, payload) {
        const guild = self.client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });

    this.client.once("ready", () => {
      self.manager.init(self.client.user?.id);
    });

    this.client.addCommandCheck(async ctx => {
      ctx.set("manager", this.manager);
      return true;
    })

    this.client.on("raw", d => self.manager.updateVoiceState(d));

    this.manager.on("nodeConnect", node => logger.info(`Connected to node ${node.options.identifier}`));
    this.manager.on("nodeError", (node, error) => logger.error(`Error on node ${node.options.identifier}:\n${error.stack}`));
    this.manager.on("trackStart", async (player, track) => {
      const lang: any = player.get("lang");

      const embed = new MessageEmbed()
        .setTitle(lang.nowPlaying)
        .setDescription(`[${track.title}](${track.uri})`) 
        .setThumbnail(track.thumbnail as string) 
        .addField(lang.duration, parseTime(Math.floor(track.duration / 1000)))
        .setFooter({ text: util.format(lang.playAuthor, track.author) });

      await (self.client.channels.cache.get(player.textChannel as string) as TextBasedChannel)?.send({ embeds: [ embed ] });  
    });

    this.manager.on("queueEnd", async player => {
      const lang: any = player.get("lang");

      await (self.client.channels.cache.get(player.textChannel as string) as TextBasedChannel)?.send(lang.allTracksPlayed);
      await player.disconnect();
      await player.destroy();
    });

    this.manager.on("playerMove", async (player, oldChannel, newChannel) => {
      const lang: any = player.get("lang");

      if (!newChannel) {
        await (self.client.channels.cache.get(player.textChannel as string) as TextBasedChannel)?.send(lang.allTracksPlayed);
        await player.disconnect();
        await player.destroy();
      }
    });

    this.manager.on("trackError", async (player, track, payload) => {
      const lang: any = player.get("lang");

      if (payload.error == "Track information is unavailable.") {
        const embed = new MessageEmbed()
         .setTitle(lang.playFailed)
         .setDescription(lang.playFailedDesc)
         .setColor("RED")

         await (self.client.channels.cache.get(player.textChannel as string) as TextBasedChannel)?.send({ embeds: [ embed ] });
      } else {
        logger.error(`Failed to play the track:`);
        console.error(payload);
      }
    });
  } 

  async onUnload() {
    for (const player of this.manager.players.values()) {
      player.queue.clear();
      player.stop();
    }
  }
}