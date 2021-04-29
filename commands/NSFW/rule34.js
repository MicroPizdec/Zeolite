const booru = require('booru')
const moment = require("moment");

module.exports = {
    name: "rule34",
    group: "NSFW_GROUP",
    description: "RULE34_DESCRIPTION",
    usage: "RULE34_USAGE",
    aliases: [ "r34" ], 
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
        const {0: post} = await booru.search("rule34.xxx", args, {limit:1, random: true})

        if (!msg.channel.nsfw) {
            return msg.reply(t(lang, "NOT_NSFW_CHANNEL"));
          }
    
        if (!post) {
           return msg.reply(t(lang, "RULE34_NOT_FOUND"));
        }
    
        moment.locale(lang);
        const createdDaysAgo = Math.floor((Date.now() - post.createdAt) / (1000 * 86400));
        const postTags = post.tags.map(tag => `\`${tag}\``).join(", ").substring(0, 1024);

        if(post.tags.includes("video")) {
            return msg.reply(t(lang, "RULE34_VIDEO", post.fileUrl, postTags))
        }
        
        const embed = {
            author: {
                name: t(lang, "RULE34_TITLE"),
                url: post.postView,
            },
            fields: [
               {
                   name: t(lang, "RULE34_SCORE"),
                   value: post.score,
               },
               {
                   name: t(lang, "RULE34_TAGS"),
                   value: postTags,
               },
            ],
            image: { url: post.fileUrl },
            footer: { text: t(lang, "RULE34_CREATEDAT") + " " + t(lang, "DAYS_AGO", createdDaysAgo), },
            timestamp: new Date(post.createdAt).toISOString(),
            color: await msg.author.embedColor(),
       }
       await msg.reply({ embed });
      }
    }