const { User, Message } = require("eris");

module.exports.load = () => {
  User.prototype.embedColor = function embedColor() {
    return embColors.findOne({ where: { user: this.id } })
      .then(c => c ? c.isRandom ? Math.round(Math.random() * 16777216) : c.color || config.embedColor : config.embedColor);
  }

  if (!Message.prototype.reply) {
    Message.prototype.reply = async function (content, file) {
      const obj = {
        message_reference: {
          message_id: this.id,
          channel_id: this.channel.id,
          guild_id: this.guildID,
        },
      };

      if (typeof content == "string") {
        obj.content = content;
      } else {
        Object.assign(obj, content);
      }

      return this.channel.createMessage(obj, file);
    }
  }

  Message.prototype.t = function (str, ...args) {
    const lang = client.languages.get(this.author.lang);

    return lang[str] ? lang[str] instanceof Function ? lang[str](...args) : lang[str] : str;
  }
}