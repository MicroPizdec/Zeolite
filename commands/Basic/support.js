const fetch = require("node-fetch");

function generateID() {
  return Math.floor(Math.random() * 1e8).toString(16);
}

module.exports = {
  name: "support",
  group: "BASIC_GROUP",
  description: "SUPPORT_DESCRIPTION",
  usage: "SUPPORT_USAGE",
  aliases: [ "report" ],
  async run(client, msg, args, prefix, lang) {
    /* let userBan = await supportBans.findOne({ where: { user: msg.author.id } });
    if (userBan && userBan.banned) {
      return msg.channel.createMessage(_(lang, "SUPPORT_BAN", userBan.reason));
    } */

    if (!args.length) {
      return msg.channel.createMessage(_(lang, "SUPPORT_NO_ARGS_PROMPT", prefix));
    }

    let question = msg.content.slice(prefix.length + this.name.length + 1);
    if (!question) {
      return msg.channel.createMessage(_(lang, "SUPPORT_EMPTY_QUESTION"));
    }

    let file;
    if (msg.attachments.length) {
      let buffer = await fetch(msg.attachments[0].url).then(r => r.buffer());

      file = {
        name: msg.attachments[0].filename,
        file: buffer,
      }
    }
  
    let id = generateID();
    let item = await support.findOne({ where: { id } });
    if (item) id = generateID();

    let supportEmbed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL,
      },
      title: "Вопрос",
      description: question,
      color: 10420479,
      timestamp: new Date().toISOString(),
      footer: { text: `ID: ${id}` },
    };

    if (file) {
      supportEmbed.image = { url: `attachment://${file.name}` };
    }

    await support.create({
      id,
      user: msg.author.id,
      channel: msg.channel.id,
      question,
    });

    await client.createMessage(client.supportChannelID, { embed: supportEmbed }, file);
    
    let embed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL, 
      },
      title: _(lang, "SUPPORT_SUCCESS"),
      description: _(lang, "SUPPORT_SUCCESS_DESC"),
      color: await msg.author.embedColor(),
    };

    await msg.channel.createMessage({ embed });
  }
};
