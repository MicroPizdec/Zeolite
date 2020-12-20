const { User } = require("eris");

module.exports.load = () => {
  User.prototype.embedColor = function embedColor() {
    return embColors.findOne({ where: { user: this.id } })
      .then(c => c?.color || 0x9f00ff);
  }
}