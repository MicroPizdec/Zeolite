// на этой ноте передаю привет котфиксу
import { ZeoliteClient } from 'zeolitecore';
import { ActivityTypes } from 'oceanic.js';
import path from 'path';
import ConfigLoader, { Config } from './utils/ConfigLoader';
import log4js from "log4js";

declare global {
  var config: Config;
  var commandsUsed: number;
}

log4js.configure({
  appenders: { out: { type: "stdout" } },
  categories: { default: { appenders: ["out"], level: "info" } },
});

global.config = ConfigLoader.loadConfig(path.join(__dirname, '..', 'config.yml'));
log4js.getLogger().level = config.debug ? "debug" : "info";

const client = new ZeoliteClient({
  auth: `Bot ${config.token}`,
  gateway: {
    intents: [ 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_INVITES', 'GUILD_BANS' ],
    presence: {
      status: "online",
      activities: [{ type: ActivityTypes.GAME, name: 'use /help' }],
    },
    getAllUsers: true,
  },
  owners: config.owners,
});

client.commandsManager.setCommandsDir(path.join(__dirname, "commands"))
  .loadAllCommands();

client.extensionsManager.setExtensionsDir(path.join(__dirname, "extensions"))
  .loadAllExtensions();

client.localizationManager.setLangsDir(path.join(__dirname, "languages"))
  .loadLanguages();

global.commandsUsed = 0;
client.on('commandSuccess', () => void commandsUsed++);

process.on('uncaughtException', (error) => console.error(error));
process.on('unhandledRejection', (error) => console.error(error));

client.connect();
