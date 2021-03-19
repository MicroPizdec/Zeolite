module.exports = {
  name: "embed",
  group: "OTHER_GROUP",
  description: "EMBED_DESCRIPTION",
  usage: "EMBED_USAGE",
  aliases: [ "emb" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(t(lang, "EMBED_NO_ARGS", prefix));
    }

    const jsonData = args.raw.join(' ');
    
    let embed;
    try {
      const data = JSON.parse(jsonData);

      if (data.embeds && data.embeds instanceof Array) embed = data.embeds[0];
      else if (data.embed) embed = data.embed;
      else embed = data;
    } catch (err) {
      embed = {
        title: t(lang, "EMBED_PARSE_ERROR"),
        description: `\`\`\`${err}\`\`\``,
        color: 15158332,
      };
    }
    
    if (embed instanceof Object) {
      await msg.channel.createMessage({ embed });
    } else {
      await msg.reply(t(lang, "EMBED_INVALID"));
    }
  }
};
