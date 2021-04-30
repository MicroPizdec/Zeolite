const NSFW = require("discord-nsfw");
const nsfw = new NSFW();

module.exports = {
    name: "feet",
    group: "NSFW_GROUP",
    description: "FEET_DESCRIPTION",
    aliases: [ "ft", "footfetish" ],
    async run(client, msg, args, prefix, lang) {
        
        if (!msg.channel.nsfw) {
            return msg.reply(t(lang, "NOT_NSFW_CHANNEL", this.name));
        }
        
        const nsfwimage = await nsfw.nekofeet();
          
        const embed = {
            author: {
                name: msg.author.tag,
                icon_url: msg.author.avatarURL,
              },
            title: t(lang, "FEET_TITLE"),
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