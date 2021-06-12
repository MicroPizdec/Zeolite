const Eris = require("eris");
const Sequelize = require("sequelize");
const package = require("../../package");
const canvas = require("canvas").version
const os = require("os");
const moment = require("moment");

function parseUptime(time) {
  const obj = new Date(time);

  let days = obj.getUTCDate() - 1;
  let hours = obj.getUTCHours();
  let minutes = obj.getUTCMinutes();
  let seconds = obj.getUTCSeconds();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return `${days}:${hours}:${minutes}:${seconds}`;
}

function getPlatform() {
  switch (process.platform) {
    case "win32":
      return "<:windows:682913067109318678> Windows";
      break;
    case "linux":
      return "<:linux:682913067025432581> Linux";
      break;
    case "android":
      return "<:android:691592978229100596> Android";
      break;
    default:
      return process.platform;
      break;
  }
}

module.exports = {
  name: "stats",
  group: "BASIC_GROUP",
  description: "STATS_COMMAND_DESCRIPTION",
  async run(client, msg, args, prefix, language) {
    const ramUsage = process.memoryUsage().heapUsed / 1048576;

    const cpu = os.cpus()[0];

    const embed = {
      title: msg.t("STATS_EMBED_TITLE"),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} v${package.version} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
      fields: [
        {
          name: msg.t("STATS_UPTIME"),
          value: parseUptime(process.uptime() * 1000),
        },
        {
          name: msg.t("STATS_PLATFORM"),
          value: getPlatform() + " " + os.arch() + " " + os.release(),
        },
        {
          name: msg.t("STATS_RAM_USAGE"),
          value: ramUsage.toFixed(1) + " " + msg.t("STATS_MEGABYTES"),
        },
        {
          name: msg.t("STATS_COMMANDS_USED"),
          value: client.usageCount,
        },
        {
          name: msg.t("STATS_SERVERS"),
          value: client.guilds.size,
          inline: true,
        },
        {
          name: msg.t("STATS_CHANNELS"),
          value: Object.keys(client.channelGuildMap).length,
          inline: true,
        },
        {
          name: msg.t("STATS_USERS"),
          value: client.users.size,
          inline: true,
        },
        {
          name: msg.t("STATS_CPU"),
          value: `${cpu ? cpu.model : msg.t("STATS_CANT_GET_CPU_INFO")}`,
        },
        {
          name: msg.t("STATS_LIBRARIES"),
          value: `Node.js: ${process.version}\nEris: ${Eris.VERSION}\nSequelize: ${Sequelize.version}\nCanvas: ${canvas}\nMoment.js: ${moment.version}`
        },
      ],
    };
    await msg.reply({ embed });
  }
}