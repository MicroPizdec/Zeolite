const CmdClient = require("./core/client");
global.config = require("./config");

const fs = require("fs");
const path = require("path");

global.client = new CmdClient(config.token, {
  prefix1: config.prefix1,
  prefix2: config.prefix2,
  owners: config.owners,
  supportChannelID: config.supportChannelID,
  defaultImageSize: 1024,
  webhookID: config.webhookID,
  webhookToken: config.webhookToken,
  guildSubscriptions: false,
  intents: [ "guilds", "guildMembers", "guildMessages" ],
});

client.version = "1.8.3";

client.loadGroups([
  "Basic",
  "Fun",
  "ZetCoins",
  "Moderation",
  "Other",
  "Settings",
  "Dev",
]);

const extensions = fs.readdirSync(path.join(__dirname, "extensions"))
  .filter(f => f.endsWith(".js"));

for (const extension of extensions) {
  client.loadExtension(path.join(__dirname, "extensions", extension))
}

process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);

client.on("error", (err, id) => client.logger.error(`Error on shard ${id}:\n${require("util").inspect(err)}`));

client.connect();
