const { User } = require("eris");

module.exports.load = () => {
  User.prototype.embedColor = function embedColor() {
    return embColors.findOne({ where: { user: this.id } })
      .then(c => c ? c.isRandom ? Math.round(Math.random() * 16777216) : c.color || config.embedColor : config.embedColor);
  }
}