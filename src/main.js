const CmdClient = require("./client");
const Sequelize = require("sequelize");
const config = require("../config");

const initDB = require("./modules/initDB");

const SDC = require("@megavasiliy007/sdc-api");
const DBL = require("dblapi.js");

const client = new CmdClient(config.token, {
  prefix1: config.prefix1,
  prefix2: config.prefix2,
  owners: config.owners,
  supportChannelID: config.supportChannelID,
  defaultImageSize: 1024,
});

const sdcClient = new SDC(config.sdcApiKey);
let dblClient;
if (config.dblApiKey) {
  dblClient = new DBL(config.dblApiKey, client);
}
  
global._ = (lang, str, ...args) => client.i18n.getTranslation.call(client.i18n, lang, str, ...args);
global.t = global._;

const sequelizeLogger = new CmdClient.Logger(client.debugMode ? CmdClient.Logger.TRACE : CmdClient.Logger.INFO, "sequelize");

global.sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./bot.db",
  logging: (...msg) => sequelizeLogger.debug(msg),
});
initDB(sequelize, Sequelize.DataTypes);

client.loadGroups([
  "Basic",
  "Fun",
  "ZetCoins",
  "Moderation",
  "Other",
  "Settings",
  "Dev",
]);

client.once("ready", () => {
  client.logger.info(`${client.user.username} online!`);
  sequelize.sync()
    .then(() => client.logger.info("successfully connected to the database."));
  
  client.editStatus("online", { name: `${client.prefix1}help`, type: 3 });

  if (config.sdcApiKey) {
    sdcClient.setAutoPost(client);
  }
});

client.on("messageCreate", async msg => {
  if (msg.content.startsWith(`${client.prefix1}reg`)) {
    if (msg.guild.id != "713037975327342602") return;
    if (msg.member.roles.includes("713115183110946857")) return;

    await msg.member.addRole("713115183110946857");
    await msg.member.removeRole("713115883794595902");
    await msg.delete();
  }
});

client.on("commandError", async (commandName, msg, error, language) => {
  if (error instanceof CmdClient.PermissionError) {
    const embed = {
      title: client.i18n.getTranslation(language, "MISSING_PERMISSION"),
      description: client.i18n.getTranslation(language, "MISSING_PERMISSION_DESCRIPTION", error.missingPermission),
      color: 15158332,
    }
    return await msg.channel.createMessage({ embed });
  }
  const embed = {
    title: `:x: Error in command ${commandName}:`,
    description: `\`\`\`\n${error}\`\`\``,
    color: 15158332,
  }
  await msg.channel.createMessage({ embed: embed });
  client.logger.error(`Error in command ${commandName}:\n${error.stack}`);
});

client.on("guildCreate", guild => {
  let embed = {
    title: "New server!",
    description: `${guild.name} (ID: ${guild.id})`,
    color: 0x9f00ff,
  };
  client.executeWebhook("709966620193456148", "uQG11BtMutep8QZW2kIcO6W9i8J2wu9P-vMxNSTflAs9AEQ5wmOo3qF8GZvtwXHKVJ9j", {
    username: "Zeolite Commands Log",
    embeds: [ embed ],
  });
});

client.on("guildDelete", guild => {
  let embed = {
    title: "I was removed from server:",
    description: `${guild.name} (ID: ${guild.id})`,
    color: 0x9f00ff,
  };
  client.executeWebhook("709966620193456148", "uQG11BtMutep8QZW2kIcO6W9i8J2wu9P-vMxNSTflAs9AEQ5wmOo3qF8GZvtwXHKVJ9j", {
    username: "Zeolite Commands Log",
    embeds: [ embed ],
  });
});

// client.on("error", (err, id) => client.logger.error(`Error on shard ${id}:\n${require("util").inspect(err)}`));

client.connect();
