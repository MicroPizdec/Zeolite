import { ZeoliteExtension, Embed } from 'zeolitecore';
import { Manager } from 'erela.js';
import util from 'util';
import Utils from '../utils/Utils';
import { getLogger } from 'log4js';
import { TextChannel } from 'oceanic.js';

let self: MusicExtension;

export default class MusicExtension extends ZeoliteExtension {
  name = 'music';
  public manager: Manager;

  public async onLoad() {
    self = this;

    if (!config.lavalinkNodes) return;

    const logger = getLogger('Music');

    this.manager = new Manager({
      nodes: config.lavalinkNodes,
      send(id, payload) {
        const guild = self.client.guilds.get(id);
        if (guild) guild.shard.send(payload.op, payload.d, false);
      },
    });

    this.client.once('ready', () => {
      self.manager.init(self.client.user?.id);
    });

    this.client.addMiddleware(async (ctx, next) => {
      ctx.set('manager', self.manager);
      await next();
    });

    this.client.on('packet', (d: any) => self.manager.updateVoiceState(d));

    this.manager.on('nodeConnect', (node) => logger.info(`Connected to node ${node.options.identifier}`));
    this.manager.on('nodeError', (node, error) =>
      logger.error(`Error on node ${node.options.identifier}:\n${error.stack}`),
    );
    this.manager.on('trackStart', async (player, track) => {
      logger.debug(`Playing track ${track.title} in channel ${player.voiceChannel}`);
      const lang: any = player.get('lang');

      const embed = new Embed()
        .setTitle(lang.nowPlaying)
        .setDescription(`[${track.title}](${track.uri})`)
        .setThumbnail(track.thumbnail as string)
        .addField(lang.duration, Utils.parseTime(Math.floor(track.duration / 1000)))
        .setFooter({ text: util.format(lang.playAuthor, track.author) });

      await this.client
        .getChannel<TextChannel>(player.textChannel!)
        ?.createMessage({ embeds: [embed] })
        .catch(() => {});
    });

    this.manager.on('queueEnd', async (player) => {
      const lang: any = player.get('lang');
      logger.debug(`Queue ended for channel ${player.voiceChannel}`);

      await this.client.getChannel<TextChannel>(player.textChannel!)?.createMessage({ content: lang.allTracksPlayed });
      await player.disconnect();
      await player.destroy();
    });

    this.manager.on('playerMove', async (player, oldChannel, newChannel) => {
      const lang: any = player.get('lang');
      logger.debug(`Player moved from channel ${oldChannel} to ${newChannel}`);

      if (!newChannel) {
        await this.client
          .getChannel<TextChannel>(player.textChannel!)
          ?.createMessage({ content: lang.allTracksPlayed });
        await player.disconnect();
        await player.destroy();
      }
    });

    this.manager.on('trackError', async (player, track, payload) => {
      const lang: any = player.get('lang');

      if (payload.error == 'Track information is unavailable.') {
        const embed = new Embed().setTitle(lang.playFailed).setDescription(lang.playFailedDesc).setColor(0xed4245);

        await this.client
          .getChannel<TextChannel>(player.textChannel!)
          ?.createMessage({ embeds: [embed] })
          .catch(() => {});
      } else {
        logger.error(`Failed to play the track:`);
        console.error(payload);
      }
    });
  }

  public async onUnload() {
    for (const player of this.manager.players.values()) {
      player.queue.clear();
      player.stop();
    }

    for (const node of this.manager.nodes.values()) {
      node.destroy();
    }
  }
}
