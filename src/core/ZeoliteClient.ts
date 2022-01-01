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
  logger = new Logger(LoggerLevel.Debug);
  cmdDirPath: string;
  extDirPath: string;
  owners: string[];

  constructor(options: ZeoliteClientOptions) {
    super(options);
    
    this.cmdDirPath = options.cmdDirPath;
    this.extDirPath = options.extDirPath;
    this.owners = options.owners;

    this.on("ready", () => {
      this.logger.info(`Logged in as ${this.user?.username}.`);

      for (const cmd of this.commands.values()) {
        this.application?.commands.create(cmd.json());
      }
    });

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

    this.logger.info(`Loaded command ${cmd.name}.`);
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
  }
}