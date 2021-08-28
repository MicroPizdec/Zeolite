const { VoiceChannel } = require("eris");

module.exports = {
  name: "modlogs",
  group: "SETTINGS_GROUP",
  description: "MODLOGS_DESCRIPTION",
  usage: "MODLOGS_USAGE",
  requiredPermissions: "manageGuild",
  guildOnly: true,
  async run(client, msg, args, prefix) {
    let channel = args[0];
    const modlogChannel = await modlogs.findOrCreate({ where: { server: msg.guild.id } })
      .then(i => i[0].channel ? client.getChannel(i[0].channel) : undefined);

    if (!channel) {
      let description;
      if (modlogChannel) {
        description = msg.t("MODLOGS_ENABLED", modlogChannel.mention);
      } else {
        description = msg.t("MODLOGS_DISABLED");
      }

      const embed = {
        description,
        color: await msg.author.embedColor(),
        footer: {
          text: msg.t("MODLOGS_FOOTER", prefix),
        },
      };

      return msg.reply({ embed });
    } else {
      if (channel === "disable") {
        await modlogs.update(
          { channel: null },
          { where: { server: msg.guild.id } }
        );

        return msg.reply(msg.t("MODLOGS_DISABLE_SUCCESS"));
      } else {
        if (channel.startsWith("<#")) {
          channel = channel.replace("<#", "").replace(">", "");
        }

        const ch = msg.guild.channels.find(c => c.id === channel || c.name === channel);
        if (!ch || (ch && ch.type > 0)) {
          return msg.reply(msg.t("INVALID_CHANNEL"));
        }
        if (!ch.memberHasPermission(msg.guild.me, "sendMessages") || !ch.memberHasPermission(msg.guild.me, "embedLinks")) {
          const embed = {
            title: msg.t("MODLOGS_FAILED"),
            description: msg.t("MODLOGS_DONT_HAVE_PERMS"),
            color: 0xff1835,
          };
          return msg.reply({ embed });
        }

        await modlogs.update(
          { channel: ch.id },
          { where: { server: msg.guild.id } },
        );

        return msg.reply(msg.t("MODLOGS_SUCCESS", ch.name));
      }
    }
  }
};