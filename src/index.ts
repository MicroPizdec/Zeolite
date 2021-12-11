import ZeoliteClient from "./core/ZeoliteClient";
import path from "path";
import config from "../config.json";
import ZeoliteContext from "./core/ZeoliteContext";

const client = new ZeoliteClient({
  cmdDirPath: path.join(__dirname, "commands"),
  extDirPath: path.join(__dirname, "extensions"),
  intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES" ],
  owners: config.owners,
});

client.loadAllCommands();
client.loadAllExtensions();

client.on("ownerOnlyCommand", (ctx: ZeoliteContext) => {
  ctx.reply({ content: "> :x: You aren't the bot owner!", ephemeral: true });
});

client.login(config.token);