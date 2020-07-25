const Eris = require("eris-additions")(require("eris"));
const fs = require("fs");

const PermissionError = require("./errors/permissionError");

const Group = require("./group");
const Logger = require("./logger");
const i18n = require("./i18n");

function validatePermission(member, permissions) {
  if (permissions instanceof Array) {

    for (const permission of permissions) {
      const hasPermission = member.permission.has(permission);
      if (!hasPermission)
        throw new PermissionError("missing permission.", permission);
    }
  } else {
    const hasPermission = member.permission.has(permissions);
    if (!hasPermission)
      throw new PermissionError("missing permission.", permissions);
  }
}

class CmdClient extends Eris.Client {
  constructor(token, options = {}) {
    super(token, options);
    this.prefix1 = options.prefix1;
    this.prefix2 = options.prefix2;
    this.owners = options.owners || [];

    this.commands = new Eris.Collection();
    this.groups = new Eris.Collection();

    this.i18n = new i18n(this);

    this.debugMode = options.debugMode || false;

    this.logger = new Logger(options.debugMode ? Logger.TRACE : Logger.INFO, "zarichbot");
    if (options.debugMode) {
      this._erisLogger = new Logger(Logger.TRACE, "eris");
      this.on("debug", msg => this._erisLogger.debug(msg));
    }

    this.supportChannelID = options.supportChannelID;

    this.on("messageCreate", async msg => {
      if ((!msg.content.startsWith(this.prefix1) && !msg.content.startsWith(this.prefix2)) || msg.author.bot) return;
      let prefixLength = this.prefix1.length;
      if (msg.content.startsWith(this.prefix2)) prefixLength = this.prefix2.length;

      const args = this._parseArgs(msg.content.slice(prefixLength));
      const cmdName = args.shift();

      const command = this.commands.find(cmd => cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName)));
      if (!command) return;

      let disabled = await disabledCmds.findOne({ where: { name: command.name } });
      if (disabled && disabled.disabled) return;

      let language = (await userLanguages.findOrCreate({ where: { user: msg.author.id } }))[0];
      if (!language.overriden) {
        if (msg.channel.guild)
          language = (await languages.findOrCreate({ where: { server: msg.channel.guild.id } }))[0];
        else language = { language: "en" };
      }
      const { banned: areCommandsBanned, reason } = (await commandBans.findOrCreate({ where: { user: msg.author.id } }))[0];
      if (areCommandsBanned) {
        const embed = {
          title: _(language.language, "COMMANDS_BANNED"),
          description: _(language.language, "COMMANDS_BANNED_REASON", reason),
          color: 15158332,
        };
        return msg.channel.createEmbed(embed);
      }

      if (command.guildOnly && !msg.channel.guild)
        return msg.channel.createMessage(this.i18n.getTranslation(language.language, "GUILD_ONLY_COMMAND"));

      if (command.ownerOnly && this.owners.indexOf(msg.author.id) === -1)
        return;
      if (!command.helpCommand) {
        if (command.ownerOnly && msg.content.startsWith(this.prefix1)) return;

        if (!command.ownerOnly && msg.content.startsWith(this.prefix2)) return;
      } else {
        if (msg.content.startsWith(this.prefix2) && !this.owners.includes(msg.author.id)) return;
      }

      try {
        if (command.requiredPermissions) validatePermission(msg.member, command.requiredPermissions);
        await command.run(this, msg, args, prefixLength == this.prefix1.length ? this.prefix1 : this.prefix2, language.language);

        const embed = {
          title: `Command \`${command.name}\` used`,
          color: 0x9f00ff,
          fields: [
            {
              name: "Message",
              value: msg.cleanContent,
            },
            {
              name: "User",
              value: `${msg.author.tag} (ID: ${msg.author.id})`,
            },
            {
              name: "Channel",
              value: `#${msg.channel.name} (ID: ${msg.channel.id})`,
            },
            {
              name: "Guild",
              value: `${msg.guild.name} (ID: ${msg.guild.id})`,
            },
          ],
        };

        if (msg.attachments.length) {
          let attachmentURLs = msg.attachments.map(a => a.url);
          embed.fields.push({
            name: "Attachments",
            value: attachmentURLs.join("\n"),
          });
        }

        await this.executeWebhook("709966620193456148", "uQG11BtMutep8QZW2kIcO6W9i8J2wu9P-vMxNSTflAs9AEQ5wmOo3qF8GZvtwXHKVJ9j", {
          username: "Zeolite Commands Log",
          embeds: [ embed ],
        });
      } catch (err) {
        this.emit("commandError", cmdName, msg, err, language.language);
      }
    });
  }

  _parseArgs(str) {
    let args = [];

    while (str.length) {
      let arg;
      if (str.startsWith('"') && str.indexOf('"', 1) > 0) {
        arg = str.slice(1, str.indexOf('"', 1));
        str = str.slice(str.indexOf('"', 1) + 1);
      } else {
        arg = str.split(/\s+/g)[0].trim();
        str = str.slice(arg.length);
      }
      args.push(arg.trim())
      str = str.trim()
    }

    return args;
  }

  loadCommand(path) {
    const command = require(path);
    if (!this.groups.has(command.group)) {
      if (command.group)
        this.groups.set(command.group, new Group(this, command.group));
      else this.groups.set("Uncategorized", new Group(this, "Uncategorized"));
    }
    
    command.path = path;

    this.commands.set(command.name, command);
    this.logger.debug(`successfully loaded ${command.name} command.`);
  }

  loadGroups(groups) {
    this.logger.info("loading the commands...")
    for (const dir of groups) {
      const commands = fs.readdirSync(`./src/commands/${dir}`).filter(f => f.endsWith(".js"));
      for (let command of commands)
        this.loadCommand(`./commands/${dir}/${command}`);
    }
    this.logger.info(`successfully loaded all commands.`);
  }

  reloadCommand(cmdName) {
    const command = this.commands.get(cmdName);
    if (!command)
      throw new Error("command does not exist.");

    const pathToCommand = require.resolve(command.path);
    delete require.cache[pathToCommand];

    this.commands.delete(cmdName);
    this.loadCommand(pathToCommand);
  }

  async connect() {
    this.logger.info("trying to login now...");
    return super.connect();
  }
}

CmdClient.PermissionError = PermissionError;
CmdClient.Group = Group;
CmdClient.Logger = Logger;
CmdClient.i18n = i18n;

module.exports = CmdClient;
