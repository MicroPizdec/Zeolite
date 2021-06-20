module.exports = {
  name: "emoji",
  group: "BASIC_GROUP",
  description: "EMOJI_DESCRIPTION",
  usage: "EMOJI_USAGE",
  aliases: [ "e", "emojiinfo" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    const emoji = args[0];

    if (!/<a:.+?:\d+>|<:.+?:\d+>/g.test(emoji)) {
      return msg.reply(msg.t("EMOJI_NOT_FOUND"));
    }

    const emojiID = emoji.match(/(?<=:)\d+/g)[0];
    const emojiName = emoji.match(/:\w+?:/)[0];
    const isAnimated = /<a/.test(emoji);

    const url = `https://cdn.discordapp.com/emojis/${emojiID}.${isAnimated ? "gif" : "png"}?v=1`;

    const embed = {
      title: emojiName,
      thumbnail: { url },
      color: await msg.author.embedColor(),
      fields: [
        {
          name: "ID",
          value: emojiID,
        },
        {
          name: msg.t("EMOJI_ANIMATED"),
          value: msg.t("YES_NO", isAnimated),
        },
      ],
      footer: {
        text: `${client.user.username} © ZariBros`,
        icon_url: client.user.avatarURL,
      },
    };
      
    await msg.reply({ embed, components: [
      {
        type: 1,
        components: [{
          type: 2,
          label: msg.t("EMOJI_URL"),
          style: 5,
          url,
        }],
      }]});
  }
    // fuck you vscode for my codestyle
}