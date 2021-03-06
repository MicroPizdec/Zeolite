const booru = require('booru')
const moment = require("moment");

module.exports = {
    name: "paheal",
    group: "NSFW_GROUP",
    description: "PAHEAL_DESCRIPTION",
    usage: "BOORU_USAGE",
    aliases: [ "pa", "r34pa" ], 
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
    const {0: post} = await booru.search("rule34.paheal.net", args, {limit:1, random: true})

    if (!msg.channel.nsfw) {
        return msg.channel.createMessage(t(lang, "NOT_NSFW_CHANNEL"));
      }

    if (!post) {
       return msg.channel.createMessage(t(lang, "POST_NOT_FOUND"));
    }

    moment.locale(lang);
    
    const embed = {
        author: {
            name: t(lang, "BOORU_TITLE"),
            url: post.postView,
        },
        fields: [
           {
               name: t(lang, "BOORU_CREATEDAT"),
               value: moment(post.createdAt).format("lll"),
               inline: true,
           },
           {
               name: t(lang, "BOORU_SCORE"),
               value: post.score,
               inline: true,
           },
           {
               name: t(lang, "BOORU_TAGS"),
               value: post.tags.join(", ").substring(0, 1024),
           },
        ],
        image: { url: post.fileUrl },
        footer: {
            text: `${client.user.username} © ZariBros`,
            icon_url: client.user.avatarURL,
        },
        color: await msg.author.embedColor(),
   }
   await msg.channel.createMessage({ embed });
  }
}