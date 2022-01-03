import ZeoliteClient from "./core/ZeoliteClient";
import path from "path";
import config from "./config";
import ZeoliteContext from "./core/ZeoliteContext";
import { Options } from "discord.js-light";

const client = new ZeoliteClient({
  cmdDirPath: path.join(__dirname, "commands"),
  extDirPath: path.join(__dirname, "extensions"),
  intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES" ],
  owners: config.owners,
  makeCache: Options.cacheWithLimits({
    ChannelManager: Infinity,
  }),
});

client.loadAllCommands();
client.loadAllExtensions();

client.on("ownerOnlyCommand", (ctx: ZeoliteContext) => {
  ctx.reply({ content: ctx.t("notBotOwner"), ephemeral: true });
});

process.on("uncaughtException", error => console.error(error));
process.on("unhandledRejection", error => console.error(error));

client.login(config.token);