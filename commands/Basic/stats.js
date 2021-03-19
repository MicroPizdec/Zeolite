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
      title: t(language, "STATS_EMBED_TITLE"),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} v${package.version} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
      fields: [
        {
          name: t(language, "STATS_UPTIME"),
          value: parseUptime(process.uptime() * 1000),
        },
        {
          name: _(language, "STATS_PLATFORM"),
          value: getPlatform() + " " + os.arch() + " " + os.release(),
        },
        {
          name: t(language, "STATS_RAM_USAGE"),
          value: ramUsage.toFixed(1) + " " + t(language, "STATS_MEGABYTES"),
        },
        {
          name: t(language, "STATS_COMMANDS_USED"),
          value: client.usageCount,
        },
        {
          name: t(language, "STATS_SERVERS"),
          value: client.guilds.size,
          inline: true,
        },
        {
          name: t(language, "STATS_CHANNELS"),
          value: Object.keys(client.channelGuildMap).length,
          inline: true,
        },
        {
          name: t(language, "STATS_USERS"),
          value: client.users.size,
          inline: true,
        },
        {
          name: t(language, "STATS_CPU"),
          value: `${cpu ? cpu.model : t(language, "STATS_CANT_GET_CPU_INFO")}`,
        },
        {
          name: _(language, "STATS_LIBRARIES"),
          value: `Node.js: ${process.version}\nEris: ${Eris.VERSION}\nSequelize: ${Sequelize.version}\nCanvas: ${canvas}\nMoment: ${moment.version}`
        },
      ],
    };
    await msg.reply({ embed });
  }
}