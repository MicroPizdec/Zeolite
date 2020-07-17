module.exports = {
    name: "poll",
    group: "BASIC_GROUP",
    description: "POLL_COMMAND_DESCRIPTION",
    usage: "POLL_COMMAND_USAGE",
    async run(client, msg, args, prefix, language) {
        if (!args.length)
            return msg.channel.createMessage(client.i18n.getTranslation(language, "POLL_NO_ARGS_PROMPT", prefix));
        
        const [ question, ...answers ] = args;
        const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯" ];

        if (!answers.length)
            return msg.channel.createMessage(client.i18n.getTranslation(language, "POLL_NO_ANSWERS", prefix));
        if (answers.length > 10)
            return msg.channel.createMessage(client.i18n.getTranslation(language, "POLL_NOT_MORE_THAN_10_ANSWERS"));
        
        const description = answers.map((answer, index) => `${reactions[index]} - ${answer}`).join("\n");

        const embed = {
            author: {
                name: client.i18n.getTranslation(language, "POLL_STARTED_BY", msg.author),
                icon_url: msg.author.avatarURL,
            },
            title: question,
            description,
            color: Math.round(Math.random() * 16777216) + 1,
        };
        const message = await msg.channel.createMessage({ embed });
        for (let i = 0; i < answers.length; i++) message.addReaction(reactions[i]);
    }
};