import ZeoliteClient from "./core/ZeoliteClient";
import path from "path";
import { Options } from "discord.js-light";
import ConfigLoader, { Config } from "./utils/ConfigLoader";

declare global {
  var config: Config;
  var commandsUsed: number;
}

global.config = new ConfigLoader().loadConfig(path.join(__dirname, "..", "config.yml"));

const client = new ZeoliteClient({
  cmdDirPath: path.join(__dirname, "commands"),
  extDirPath: path.join(__dirname, "extensions"),
  intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES" ],
  owners: config.owners,
  makeCache: Options.cacheWithLimits({
    ChannelManager: Infinity,
  }),
  debug: config.debug,
  ws: {
    properties: { $browser: "Discord Android" },
  },
});

client.loadAllCommands();
client.loadAllExtensions();

global.commandsUsed = 0;
client.on("commandSuccess", () => void commandsUsed++);

process.on("uncaughtException", error => console.error(error));
process.on("unhandledRejection", error => console.error(error));

client.login(config.token);