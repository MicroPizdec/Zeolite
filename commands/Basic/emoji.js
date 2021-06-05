module.exports = {
    name: "emoji",
    group: "BASIC_GROUP",
    description: "EMOJI_DESCRIPTION",
    usage: "EMOJI_USAGE",
    aliases: [ "e", "emojiinfo" ],
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
        const emojiName = args[0];

        const emoji = msg.guild.emojis.find(e => 
            e.name == emojiName ||
            e.id == emojiName ||
            new RegExp(`<a:${e.name}:${e.id}>|<:${e.name}:${e.id}>`, "g").test(emojiName)
            // "wtf, zarich?" x3? 'cause i don't know how to use regexp
            // ну ща получается будет фикс
        );

        if (!emoji) {
           return msg.reply(t(lang, "EMOJI_NOT_FOUND"));
        }

        const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}?v=1`;

        const embed = {
            title: `:${emoji.name}:`,
            thumbnail: { url },
            color: await msg.author.embedColor(),
            fields: [
               {
                   name: "ID",
                   value: emoji.id,
               },
               {
                name: t(lang, "EMOJI_ANIMATED"),
                value: t(lang, "YES_NO", emoji.animated),
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
              label: t(lang, "EMOJI_URL"),
              style: 5,
              url,
            }],
          }]});
    }
    // fuck you vscode for my codestyle
}