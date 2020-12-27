const fetch = require("node-fetch");

function getFilenameFromURL(url) {
  const array = url.split("/");
  return array[array.length - 1];
}

module.exports = {
  name: "say",
  group: "FUN_GROUP",
  description: "SAY_COMMAND_DESCRIPTION",
  usage: "<text>",
  helpCommand: true,
  async run(client, msg, args, prefix, language) {
    if (!args.length && !msg.attachments.length)
      return msg.channel.createMessage(t(language, "SAY_NO_ARGS_PROMPT", prefix));
    
    let text = msg.content.slice(prefix.length + this.name.length + 1);

    let embed = {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL,
      },
      color: await msg.author.embedColor(),
    };

    let file;
    if (msg.attachments.length) {
      const attachment = msg.attachments[0];
      const filename = getFilenameFromURL(attachment.url);
      file = {
        file: await fetch(attachment.url).then(r => r.buffer()),
        name: filename,
      };
      embed.image = { url: `attachment://${filename}` };
    }

    if (text) embed.description = text

    try {
      await msg.delete();
    } catch {}

    await msg.channel.createMessage({ embed }, file);
  }
};
