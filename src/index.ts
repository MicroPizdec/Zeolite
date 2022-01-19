import ZeoliteClient from "./core/ZeoliteClient";
import path from "path";
import ZeoliteContext from "./core/ZeoliteContext";
import { Options } from "discord.js-light";
import ConfigLoader, { Config } from "./utils/ConfigLoader";
import { CITEXT } from "sequelize/types";

declare global {
  var config: Config;
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
});

client.loadAllCommands();
client.loadAllExtensions();

client.on("ownerOnlyCommand", (ctx: ZeoliteContext) => {
  ctx.reply({ content: ctx.t("notBotOwner"), ephemeral: true });
});

client.on("commandCooldown", (ctx: ZeoliteContext, secsLeft: number) => {
  ctx.reply({ content: ctx.t("cooldown", secsLeft), ephemeral: true });
});

client.on("guildOnlyCommand", (ctx: ZeoliteContext) => {
  ctx.reply({ content: ctx.t("guildOnlyCommand"), ephemeral: true });
})

process.on("uncaughtException", error => console.error(error));
process.on("unhandledRejection", error => console.error(error));

client.login(config.token);