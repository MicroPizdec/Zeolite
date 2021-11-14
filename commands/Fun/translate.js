const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: "translate",
    group: "FUN_GROUP",
    description: "TRANSLATE_DESCRIPTION",
    usage: "TRANSLATE_USAGE",
    aliases: [ "translator", "tr" ],
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
        const text = args.slice(1).join(" ")
        const language = args[0]

        if (!text) {
            return msg.reply(msg.t("TRANSLATE_NO_TEXT"))
        }
        
        let res
        try{
            res = await translate(text, {to: language})
        }catch(error){
            if(error.message.endsWith("is not supported")) return msg.reply(msg.t("TRANSLATE_INVALID_LANG"))
            else throw error
        }

        const embed = {
            author: {
                name: msg.author.tag,
                icon_url: msg.author.avatarURL,
            },
            title: msg.t("TRANSLATE_TITLE", res.from.language.iso),
            description: `\`\`\`${res.text}\`\`\``,
            color: await msg.author.embedColor(),
            footer: {
                text: `${client.user.username} © Fishyrene`,
                icon_url: client.user.avatarURL,
              },
        }
        await msg.reply({ embed });
    }
};