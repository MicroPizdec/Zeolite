const { exec } = require("child_process");

module.exports = {
    name: "exec",
    group: "DEV_GROUP",
    description: "EXEC_DESCRIPTION",
    usage: "EXEC_USAGE",
    hidden: true,
    ownerOnly: true,
    argsRequired: true,
    async run(client, msg, args, prefix, lang) {
        const expr = args.raw.join(" ");

        exec(expr, (err, stdout, stderr) => {
          if (err) return msg.reply(`\`\`\`${err}\`\`\``);
          msg.reply(`\`\`\`${stdout}\`\`\``);
        });
    }
}