const CmdClient = require("./core/CmdClient");
global.config = require("./config");

const fs = require("fs");
const path = require("path");

global.client = new CmdClient(config.token, {
  async prefix(client, msg) {
    return await prefixes.findOne({ where: { server: msg.guild.id } })
     .then(p => p && p.prefix) || config.prefix;
  },
  owners: config.owners,
  defaultImageSize: 1024,
  guildSubscriptions: false,
  intents: [ "guilds", "guildMembers", "guildMessages" ],
  getAllUsers: true,
  db: config.db,
});

client.webhookID = config.webhookID,
client.webhookToken = config.webhookToken,

client.usageCount = 0;
client.on("commandSuccess", () => client.usageCount++);

client.options.allowedMentions.replied_user = false;

const groups = [ "Basic", "Fun", "ZetCoins", "Moderation", "NSFW", "Other", "Settings", "Dev" ];
for (const group of groups) {
  client.loadCommandGroup(path.join(__dirname, "commands", group));
}

const extensions = fs.readdirSync(path.join(__dirname, "extensions"))
  .filter(f => f.endsWith(".js"));

for (const extension of extensions) {
  client.loadExtension(path.join(__dirname, "extensions", extension))
}

process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);

client.on("error", (err, id) => client.logger.error(`Error on shard ${id}:\n${require("util").inspect(err)}`));

client.on("commandCooldown", async (cmd, msg, secsLeft) => {
  return msg.reply(msg.t("COOLDOWN", secsLeft));
});

client.connect();