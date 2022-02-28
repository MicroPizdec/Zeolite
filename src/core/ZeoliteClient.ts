import { Client, Interaction, User, GuildMember, PermissionResolvable } from "discord.js-light";
import { Collection } from "@discordjs/collection";
import ZeoliteCommand from "./ZeoliteCommand";
import ZeoliteClientOptions from "./ZeoliteClientOptions";
import ZeoliteExtension from "./ZeoliteExtension";
import Logger, { LoggerLevel } from "./Logger";
import fs from "fs";
import path from "path";
import ZeoliteContext from "./ZeoliteContext";
import ZeoliteLocalization from "./ZeoliteLocalization";

export type CheckFunc = (ctx: ZeoliteContext) => Promise<boolean>;

export default class ZeoliteClient extends Client {
  public commands: Collection<string, ZeoliteCommand>;
  public extensions: Collection<string, ZeoliteExtension>;
  public cooldowns: Collection<string, Collection<string, number>>;
  public localization: ZeoliteLocalization;
  public logger: Logger;
  public cmdDirPath: string;
  public extDirPath: string;
  public owners: string[];
  public checks: CheckFunc[] = [];

  private debug: boolean;
  private djsLogger: Logger;

  public constructor(options: ZeoliteClientOptions) {
    super(options);

    this.commands = new Collection();
    this.extensions = new Collection();
    this.cooldowns = new Collection();
    
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

  public async handleCommand(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const cmd: ZeoliteCommand | undefined = this.commands.get(interaction.commandName);
    if (!cmd) return;

    const ctx = new ZeoliteContext(this, interaction);

    for (const check of this.checks) {
      const result = await check(ctx);
      if (!result) return;
    }

    if (cmd.ownerOnly && !this.isOwner(ctx.user)) {
      this.emit("ownerOnlyCommand", ctx);
      return;
    }

    if (cmd.guildOnly && !ctx.guild) {
      this.emit("guildOnlyCommand", ctx);
      return;
    }

    if (cmd.cooldown) {
      if (!this.cooldowns.has(cmd.name)) {
        this.cooldowns.set(cmd.name, new Collection<string, number>());
      }

      let cmdCooldowns = this.cooldowns.get(cmd.name);
      let now = Date.now();
      if (cmdCooldowns?.has(ctx.user.id)) {
        let expiration = (cmdCooldowns.get(ctx.user.id) as number) + (cmd.cooldown * 1000);
        if (now < expiration) {
          let secsLeft = Math.floor((expiration - now) / 1000);
          this.emit("commandCooldown", ctx, secsLeft);
          return;
        }
      }
    }

    try {
      if (!this.validatePermissions(ctx.member, cmd.requiredPermissions)) {
        this.emit("noPermissions", ctx, cmd.requiredPermissions);
        return;
      }

      await cmd.run(ctx);
      this.emit("commandSuccess", ctx);
      if (cmd.cooldown) {
        const cmdCooldowns = this.cooldowns.get(cmd.name);
        cmdCooldowns?.set(ctx.user.id, Date.now());
        setTimeout(() => cmdCooldowns?.delete(ctx.user.id), cmd.cooldown * 1000);
      }
    } catch (error: any) {
      this.emit("commandError", ctx, error);
    }
  }

  public validatePermissions(member: GuildMember, perms: string[]): boolean {
    for (const perm of perms) {
      if (!member.permissions.has(perm as PermissionResolvable)) return false;
    }

    return true;
  }

  public loadAllCommands() {
    const files = fs.readdirSync(this.cmdDirPath);

    for (const file of files) {
      this.loadCommand(file);
    }

    this.logger.info("Loaded all commands.");
  }

  public loadCommand(name: string): ZeoliteCommand {
    const cmdCls: typeof ZeoliteCommand = require(path.join(this.cmdDirPath, name)).default;
    const cmd = new cmdCls(this);
      
    this.commands.set(cmd.name, cmd);

    this.logger.debug(`Loaded command ${cmd.name}.`);

    return cmd;
  }

  public unloadCommand(name: string) {
    if (!this.commands.has(name)) {
      throw new Error("this command does not exist.");
    }

    const cmd = this.commands.get(name);
    const cmdPath = require.resolve(path.join(this.cmdDirPath, cmd!.name));

    delete require.cache[cmdPath];
    this.commands.delete(cmd!.name);

    this.logger.debug(`Unloaded command ${name}.`);
  }

  public reloadCommand(name: string): ZeoliteCommand {
    this.unloadCommand(name);
    return this.loadCommand(name);
  }

  public async login(token: string): Promise<string> {
    this.logger.info("Logging in...");
    return super.login(token);
  }

  public isOwner(user: User): boolean {
    return this.owners.includes(user.id);
  }

  public loadAllExtensions() {
    const files = fs.readdirSync(this.extDirPath);

    for (const file of files) {
      this.loadExtension(file);
    }

    this.logger.info("Loaded extensions.");
  }

  public loadExtension(name: string): ZeoliteExtension {
    const extCls: typeof ZeoliteExtension = require(path.join(this.extDirPath, name)).default;
    const ext = new extCls(this);

    this.extensions.set(ext.name, ext);
    ext.onLoad();

    this.logger.debug(`Loaded extension ${ext.name}`);

    return ext;
  }
  
  public unloadExtension(name: string) {
    if (!this.extensions.has(name)) {
      throw new Error("this extension does not exist.");
    }

    const ext = this.extensions.get(name);
    const extPath = require.resolve(path.join(this.extDirPath, ext!.name));

    delete require.cache[extPath];
    this.extensions.delete(ext!.name);

    this.logger.debug(`Unloaded extension ${ext!.name}.`);
  }

  public reloadExtension(name: string): ZeoliteExtension {
    this.unloadExtension(name);
    return this.loadExtension(name);
  }

  public addCommandCheck(checkFunc: CheckFunc) {
    this.checks.push(checkFunc);
  }
}