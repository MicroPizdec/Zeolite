// на этой ноте передаю привет котфиксу
import { ZeoliteClient } from 'zeolitecore';
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
client.localization.loadLanguages();

// this will be moved to ZeoliteCore
/*сlient.on('commandError', (ctx, error) => {
  console.log(error);
});
client.on('warn', (msg) => client.logger.warn(msg));
client.on('error', (err, id) => {
  console.log(err);
}); */

global.commandsUsed = 0;
client.on('commandSuccess', () => void commandsUsed++);
client.on('ready', async () => {
  await client.editStatus('online', { type: 1, name: 'use /help' });
});

process.on('uncaughtException', (error) => console.error(error));
process.on('unhandledRejection', (error) => console.error(error));

client.connect();
