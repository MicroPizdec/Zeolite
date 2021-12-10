import ZeoliteClient from "./core/ZeoliteClient";
import path from "path";
import config from "../config.json";

const client = new ZeoliteClient({
  cmdDirPath: path.join(__dirname, "commands"),
  extDirPath: path.join(__dirname, "extensions"),
  intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES" ],
  owners: config.owners,
});

client.loadAllCommands();

client.login(config.token);