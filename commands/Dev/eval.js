const Eris = require("eris");

/* function insertReturn(code) {
  let codeLines = code.split("\n");

  let lastCodeLine = codeLines[codeLines.length - 1];
  let firstWord = lastCodeLine.split(" ")[0];
  if (firstWord.startsWith("throw") || firstWord.startsWith("return")) return code;
  lastCodeLine = `return ${lastCodeLine}`;

  codeLines[codeLines.length - 1] = lastCodeLine;

  return codeLines.join("\n");
} */

module.exports = {
  name: "eval",
  group: "DEV_GROUP",
  description: "EVAL_COMMAND_DESCRIPTION",
  hidden: true,
  ownerOnly: true,
  usage: "EVAL_COMMAND_USAGE",
  async run(client, msg, args, prefix) {
    let code = msg.content.slice(prefix.length + this.name.length + 1);
    // code = insertReturn(code);
    let asyncifiedCode = `(async () => {\n${code}\n})()`;

    try {
      let evaled = await eval(asyncifiedCode);
      
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      await msg.channel.createMessage(`\`\`\`js\n${evaled}\n\`\`\``);
    } catch (err) {
      await msg.channel.createMessage(`\`\`\`js\n${err}\n\`\`\``);
    }
  }
};
