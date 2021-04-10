const booru = require('booru')
const moment = require("moment");

module.exports = {
    name: "rule34",
    group: "NSFW_GROUP",
    description: "RULE34_DESCRIPTION",
    usage: "BOORU_USAGE",
    aliases: [ "r34" ], 
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
        const {0: post} = await booru.search("rule34.xxx", args, {limit:1, random: true})

        if (!msg.channel.nsfw) {
            return msg.reply(t(lang, "NOT_NSFW_CHANNEL"));
          }
    
        if (!post) {
           return msg.reply(t(lang, "POST_NOT_FOUND"));
        }
    
        moment.locale(lang);
        const createdDaysAgo = Math.floor((Date.now() - post.createdAt) / (1000 * 86400));
        const postTags = post.tags.map(tag => `\`${tag}\``).join(", ").substring(0, 1024);

        if(post.tags.includes("video")) {
            return msg.reply(t(lang, "BOORU_VIDEO", post.fileUrl, postTags))
        }
        
        const embed = {
            author: {
                name: t(lang, "BOORU_TITLE"),
                url: post.postView,
            },
            fields: [
               {
                   name: t(lang, "BOORU_CREATEDAT"),
                   value: moment(post.createdAt).format("lll") + " " + t(lang, "DAYS_AGO", createdDaysAgo),
                   inline: true,
               },
               {
                   name: t(lang, "BOORU_SCORE"),
                   value: post.score,
                   inline: true,
               },
               {
                   name: t(lang, "BOORU_TAGS"),
                   value: postTags,
               },
            ],
            image: { url: post.fileUrl },
            footer: {
                text: `${client.user.username} © ZariBros`,
                icon_url: client.user.avatarURL,
            },
            color: await msg.author.embedColor(),
       }
       await msg.reply({ embed });
      }
    }