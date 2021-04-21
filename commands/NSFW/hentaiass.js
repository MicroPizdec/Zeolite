const NSFW = require("discord-nsfw");
const nsfw = new NSFW();

module.exports = {
    name: "hentaiass",
    group: "NSFW_GROUP",
    description: "HENTAIASS_DESCRIPTION",
    aliases: [ "henass", "hnass" ],
    async run(client, msg, args, prefix, lang) {
        
        if (!msg.channel.nsfw) {
            return msg.reply(t(lang, "NOT_NSFW_CHANNEL"));
        }
        
        const nsfwimage = await nsfw.hentaiass();
          
        const embed = {
            author: {
                name: msg.author.tag,
                icon_url: msg.author.avatarURL,
              },
            title: t(lang, "HENTAI_TITLE"),
            image: { url: nsfwimage },
            color: await msg.author.embedColor(),
            footer: {
                text: `${client.user.username} © ZariBros`,
                icon_url: client.user.avatarURL,
            },
        }
        await msg.reply({ embed });
    }
}