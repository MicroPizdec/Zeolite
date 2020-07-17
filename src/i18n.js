const fs = require("fs");

class i18n {
  constructor(client) {
    this.client = client;
    this.locales = this._loadLanguages();
  }

  _loadLanguages() {
    let langs = {}
    
    let files = fs.readdirSync("./src/locales").filter(f => f.endsWith(".js"));
    for (let file of files) {
      let lang = require(`./locales/${file}`);
      langs[file.replace(".js", "")] = lang;
    }

    return langs;
  }

  getTranslation(language, string, ...args) {
    let localizedString;
    if (this.locales[language][string] instanceof Function)
      localizedString = this.locales[language][string](...args);
    else localizedString = this.locales[language][string];
    return localizedString || string;
  }
};

module.exports = i18n;
