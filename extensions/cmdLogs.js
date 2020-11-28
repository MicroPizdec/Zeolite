const PermissionError = require("../core/errors/permissionError");

const color = 0x9f00ff;

async function onCommandSuccess(cmd, msg) {
  await this.executeWebhook(this.webhookID, this.webhookToken, {
    username: `${this.user.username} Commands Log`,
    embeds: [
      {
        title: `Command \`${cmd.name}\` used`,
        description: msg.cleanContent,
        color,
        fields: [
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
          }
        ],
      },
    ],
  });
}

async function onGuildCreate(guild) {
  await this.executeWebhook(this.webhookID, this.webhookToken, {
    username: `${this.user.username} Commands Log`,
    embeds: [
      {
        title: `New server!`,
        description: `${guild.name} (ID: ${guild.id})`,
        color,
        thumbnail: { url: guild.iconURL },
      },
    ],
  });
}

async function onGuildDelete(guild) {
  await this.executeWebhook(this.webhookID, this.webhookToken, {
    username: `${this.user.username} Commands Log`,
    embeds: [
      {
        title: "I was removed from server:",
        description: `${guild.name} (ID: ${guild.id})`,
        color,
        thumbnail: { url: guild.iconURL },
      },
    ],
  });
}

async function onCommandError(cmd, msg, error, language) {
  if (error instanceof PermissionError) {
    const embed = {
      title: t(language, "MISSING_PERMISSION"),
      description: t(language, "MISSING_PERMISSION_DESCRIPTION", error.missingPermission),
      color: 15158332,
    }
    return await msg.channel.createMessage({ embed });
  }
  
  const embed = {
    title: t(language, "COMMAND_ERROR_OCCURRED"),
    description: t(language, "COMMAND_ERROR_DESCRIPTION"),
    color: 15158332,
  }
  await msg.channel.createMessage({ embed: embed });
  
  await this.executeWebhook(this.webhookID, this.webhookToken, {
    username: `${this.user.username} Commands Log`,
    embeds: [
      {
        title: ":x: An error occurred while executing the command",
        description: msg.content,
        color: 13440534,
        fields: [
          {
            name: "Error",
            value: `\`\`\`${error}\`\`\``,
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
      }
    ],
  });
  this.logger.error(`Error in command ${cmd.name}:\n${error.stack}`);
}

module.exports.load = client => client.on("commandSuccess", onCommandSuccess)
  .on("guildCreate", onGuildCreate)
  .on("guildDelete", onGuildDelete)
  .on("commandError", onCommandError);

module.exports.unload = client => client.off("commandSuccess", onCommandSuccess)
  .off("guildCreate", onGuildCreate)
  .off("guildDelete", onGuildDelete)
  .off("commandError", onCommandError);
  