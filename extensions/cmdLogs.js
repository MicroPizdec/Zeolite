const PermissionError = require("../core/errors/PermissionError");

const color = config.embedColor;

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
        footer: { text: `Total members: ${guild.memberCount}` }
      },
    ],
  });
}

async function onGuildDelete(guild) {
  await this.executeWebhook(this.webhookID, this.webhookToken, {
    username: `${this.user.username} Commands Log`,
    embeds: [
      {
        title: "I was removed from server",
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
      title: msg.t("MISSING_PERMISSION"),
      description: msg.t("MISSING_PERMISSION_DESCRIPTION", error.missingPermission),
      color: 15158332,
    }
    return await msg.reply({ embed });
  }
  
  const embed = {
    title: msg.t("COMMAND_ERROR_OCCURRED"),
    description: msg.t("COMMAND_ERROR_DESCRIPTION"),
    footer: {
      text: `${client.user.username} © ZariBros`,
      icon_url: client.user.avatarURL,
    },
    color: 15158332,
  }
  await msg.reply({ embed: embed });
  
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
  
