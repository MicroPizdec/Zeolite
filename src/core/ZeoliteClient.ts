import { Client, Interaction, User } from "discord.js-light";
import { Collection } from "@discordjs/collection";
import ZeoliteCommand from "./ZeoliteCommand";
import ZeoliteClientOptions from "./ZeoliteClientOptions";
import ZeoliteExtension from "./ZeoliteExtension";
import Logger, { LoggerLevel } from "./Logger";
import fs from "fs";
import path from "path";
import ZeoliteContext from "./ZeoliteContext";
import ZeoliteLocalization from "./ZeoliteLocalization";

export default class ZeoliteClient extends Client {
  commands = new Collection<string | undefined, ZeoliteCommand>();
  extensions = new Collection<string, ZeoliteExtension>();
  localization: ZeoliteLocalization;
  private debug: boolean;
  logger: Logger;
  private djsLogger: Logger;
  cmdDirPath: string;
  extDirPath: string;
  owners: string[];

  constructor(options: ZeoliteClientOptions) {
    super(options);
    
    this.cmdDirPath = options.cmdDirPath;
    this.extDirPath = options.extDirPath;
    this.owners = options.owners;
    this.debug = options.debug || false;

    this.logger = new Logger(this.debug ? LoggerLevel.Debug : LoggerLevel.Info, "ZeoliteClient");

    this.on("ready", () => {
      this.logger.info(`Logged in as ${this.user?.username}.`);

      for (const cmd of this.commands.values()) {
        this.application?.commands.create(cmd.json());
      }
    });

    if (this.debug) {
      this.djsLogger = new Logger(LoggerLevel.Debug, "discord.js");

      this.on("debug", msg => this.djsLogger.debug(msg));
    }

    this.on("interactionCreate", this.handleCommand);

    this.localization = new ZeoliteLocalization(this);

    this.logger.info("ZeoliteClient initialized.");

    this.localization.loadLanguages();
  }

  async handleCommand(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const cmd: ZeoliteCommand | undefined = this.commands.get(interaction.commandName);
    if (!cmd) return;

    const ctx = new ZeoliteContext(this, interaction);

    if (cmd.ownerOnly && !this.isOwner(ctx.user)) {
      this.emit("ownerOnlyCommand", ctx);
      return;
    }

    if (cmd.guildOnly && !ctx.guild) {
      this.emit("guildOnlyCommand", ctx);
      return;
    }

    try {
      await cmd.run(ctx);
      this.emit("commandSuccess", ctx);
    } catch (error: any) {
      this.emit("commandError", ctx, error);

      this.logger.error(`Error in command ${cmd.name}:`);
      console.error(error);
    }
  }

  loadAllCommands() {
    const files = fs.readdirSync(this.cmdDirPath);

    for (const file of files) {
      this.loadCommand(file);
    }

    this.logger.info("Loaded all commands.");
  }

  loadCommand(name: string) {
    const cmdCls: typeof ZeoliteCommand = require(path.join(this.cmdDirPath, name)).default;
    const cmd = new cmdCls(this);
      
    this.commands.set(cmd.name, cmd);

    this.logger.debug(`Loaded command ${cmd.name}.`);
  }

  unloadCommand(name: string) {
    if (!this.commands.has(name)) {
      throw new Error("this command does not exist.");
    }

    const cmd = this.commands.get(name) as ZeoliteCommand;

    const cmdPath = require.resolve(path.join(this.cmdDirPath, name));

    delete require.cache[cmdPath];
    this.commands.delete(name);

    this.logger.debug(`Unloaded command ${name}.`);
  }

  reloadCommand(name: string) {
    this.unloadCommand(name);
    this.loadCommand(name);
  }

  async login(token: string): Promise<string> {
    this.logger.info("Logging in...");
    return super.login(token);
  }

  isOwner(user: User): boolean {
    return this.owners.includes(user.id);
  }

  loadAllExtensions() {
    const files = fs.readdirSync(this.extDirPath);

    for (const file of files) {
      this.loadExtension(file);
    }

    this.logger.info("Loaded extensions.");
  }

  loadExtension(name: string) {
    const extCls: typeof ZeoliteExtension = require(path.join(this.extDirPath, name)).default;
    const ext = new extCls(this);

    this.extensions.set(ext.name, ext);
    ext.onLoad();

    this.logger.debug(`Loaded extension ${name}`);
  }
}