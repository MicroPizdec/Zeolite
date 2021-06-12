const intToHex = require("../../utils/intToHex");
const moment = require("moment");

module.exports = {
  name: "role",
  group: "BASIC_GROUP",
  description: "ROLE_DESCRIPTION",
  usage: "ROLE_USAGE",
  aliases: [ "r", "roleinfo" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    let roleID = args.raw[0];

    const role = msg.guild.roles.find(r => 
      r.name.toLowerCase().startsWith(roleID) ||
      r.mention == roleID ||
      r.id == roleID  
    );

    if (!role) {
      return msg.reply(msg.t("ROLE_NOT_FOUND"));
    }

    moment.locale(msg.author.lang);

    const membersWithRole = msg.guild.members.filter(m => m.roles.includes(role.id))
      .length;
    const createdDaysAgo = Math.floor((Date.now() - role.createdAt) / (86400 * 1000));

    const embed = {
      title: role.name,
      color: role.color || await msg.author.embedColor(),
      fields: [
        {
          name: "ID",
          value: role.id,
        },
        {
          name: msg.t("ROLE_CREATED_AT"),
          value: moment(role.createdAt).format("lll") + " " + msg.t("DAYS_AGO", createdDaysAgo)
        },
        {
          name: msg.t("ROLE_MEMBERS"),
          value: membersWithRole,
        },
        {
          name: msg.t("ROLE_MENTIONABLE"),
          value: msg.t("YES_NO", role.mentionable),
        },
        {
          name: msg.t("ROLE_HOISTED"),
          value: msg.t("YES_NO", role.hoist),
        },
        {
          name: msg.t("ROLE_MANAGED"),
          value: msg.t("YES_NO", role.managed),
        },
        {
          name: msg.t("ROLE_COLOR"),
          value: role.color ? `#${intToHex(role.color)}` : msg.t("ROLE_COLOR_DEFAULT"),
        },
      ],
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };

    await msg.reply({ embed });
  }
}