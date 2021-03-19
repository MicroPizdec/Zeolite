const moment = require("moment");

function intToHex(int) {
  let hexStr = int.toString(16);

  while (hexStr.length > 6) {
    hexStr = 0 + hexStr;
  }

  return `#${hexStr}`;
}

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
      return msg.reply(t(lang, "ROLE_NOT_FOUND"));
    }

    moment.locale(lang);

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
          name: t(lang, "ROLE_CREATED_AT"),
          value: moment(role.createdAt).format("lll") + " " + _(lang, "USERINFO_CREATED_DAYS_AGO", createdDaysAgo)
        },
        {
          name: t(lang, "ROLE_MEMBERS"),
          value: membersWithRole,
        },
        {
          name: t(lang, "ROLE_MENTIONABLE"),
          value: t(lang, "YES_NO", role.mentionable),
        },
        {
          name: t(lang, "ROLE_HOISTED"),
          value: t(lang, "YES_NO", role.hoist),
        },
        {
          name: t(lang, "ROLE_MANAGED"),
          value: t(lang, "YES_NO", role.managed),
        },
        {
          name: t(lang, "ROLE_COLOR"),
          value: role.color ? intToHex(role.color) : t(lang, "ROLE_COLOR_DEFAULT"),
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