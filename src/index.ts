// на этой ноте передаю привет котфиксу
import { ZeoliteClient, ZeoliteContext } from 'zeolitecore';
import path from 'path';
import ConfigLoader, { Config } from './utils/ConfigLoader';

declare global {
  var config: Config;
  var commandsUsed: number;
}

global.config = new ConfigLoader().loadConfig(path.join(__dirname, '..', 'config.yml'));

const client = new ZeoliteClient(config.token, {
  cmdDirPath: path.join(__dirname, 'commands'),
  extDirPath: path.join(__dirname, 'extensions'),
  langsDirPath: path.join(__dirname, 'languages'),
  intents: ['guilds', 'guildMembers', 'guildMessages', 'guildVoiceStates', 'guildInvites', 'guildBans'],
  owners: config.owners,
  debug: config.debug,
  restMode: true,
  getAllUsers: true,
  defaultImageSize: 2048,
});

client.loadAllCommands();
client.loadAllExtensions();

client.on('commandError', (ctx: ZeoliteContext, error: any) => {
  console.log(error);
});

global.commandsUsed = 0;
client.on('commandSuccess', () => void commandsUsed++);
/*client.on("ready", () => {
  client.user?.setPresence({
    activities: [ { name: "Более нормальный бот чем у конкурентов с подписками за 11 даларов", type: "PLAYING" } ],
  });
});*/

process.on('uncaughtException', (error) => console.error(error));
process.on('unhandledRejection', (error) => console.error(error));

client.connect();
