module.exports = {
  name: "discrim",
  group: "OTHER_GROUP",
  description: "DISCRIM_DESCRIPTION",
  usage: "DISCRIM_USAGE",
  aliases: [ "discriminator" ],
  async run(client, msg, args, prefix, lang) {
    let discriminator = args[0] || msg.author.discriminator;

    const discrimNumber = parseInt(discriminator);
    if (isNaN(discrimNumber) || discrimNumber > 9999 || discrimNumber < 1 || !/\d{4}$/g.test(discriminator.toString())) {
      return msg.reply(msg.t("INVALID_DISCRIM"));
    }

    while (discriminator.length < 4) {
      discriminator = "0" + discriminator;
    }

    const users = Array.from(client.users.values())
      .filter(u => u.discriminator === discriminator)
      .splice(0, 20)
      .map(u => u.tag)
      .join("\n")
      .replace(/[_~*\|]/g, "\\$&");

    const embed = {
      author: {
        name: msg.t("DISCRIM_TITLE", discriminator),
        icon_url: msg.author.avatarURL,
      },
      description: users || msg.t("DISCRIM_USERS_NOT_FOUND"),
      color: await msg.author.embedColor(),
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
  
    await msg.reply({ embed }); 
  }
}