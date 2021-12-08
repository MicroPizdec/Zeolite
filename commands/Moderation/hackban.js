module.exports = {
    name: "hackban",
    group: "MODERATION_GROUP",
    description: "HACKBAN_DESCRIPTION",
    usage: "HACKBAN_USAGE",
    requiredPermissions: "banMembers",
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
        const [ userID, ...reason ] = args;

        const user = await client.fetchUser(userID);

        if (!user) {
            return msg.reply(msg.t("USER_NOT_FOUND"));
          }

        try {
           if (userID === msg.author.id) {
            return msg.reply(msg.t("CANT_BAN_YOURSELF"));
           }
           if (userID === client.user.id) {
              return msg.reply(msg.t("CANT_BAN_BOT"));
           }
      
           if (msg.guild.members.has(userID)) {
              return msg.reply(msg.t("HACKBAN_ALREADY_IN_SERVER"));
           }
      
            await msg.channel.guild.banMember(userID, 0, encodeURI(reason));

            const embed = {
                title: msg.t("HACKBAN_SUCCESS", user.tag),
                description: msg.t("REASON", reason.join(" ")),
                color: 0x18ff3d,
                timestamp: new Date().toISOString(),
              };
              await msg.reply({ embed });
            } catch (err) {
              let description;
              if (!msg.channel.guild.members.get(client.user.id).permission.has("banMembers")) {
                description = msg.t("BAN_DONT_HAVE_PERMS");
              }
              else { description = msg.t("SOMETHING_WENT_WRONG"); }
        
              const embed = {
                title: msg.t("HACKBAN_FAILED"),
                description,
                color: 0xff1835,
              };
              await msg.reply({ embed });
            }
          }
        }
