import ZeoliteClient from "./ZeoliteClient";
import Languages from "../dbModels/Languages";
import { User } from "discord.js-light";
import fs from "fs";
import path from "path";
import util from "util";

type L10nFunc = string | ((...args: any[]) => string);
let self: ZeoliteLocalization;

export default class ZeoliteLocalization {
  languageStrings: Record<string, Record<string, string>> = {};
  userLanguages: Record<string, string | undefined> = {};
  readonly client: ZeoliteClient;
  
  constructor(client: ZeoliteClient) {
    this.client = client;
    self = this;

    this.client.off("interactionCreate", this.client.handleCommand);

    this.client.on("interactionCreate", async interaction => {
      if (!self.userLanguages[interaction.user.id]) {
        self.userLanguages[interaction.user.id] = await self.getUserLanguage(interaction.user);
      }

      await self.client.handleCommand(interaction);
    });
  }

  async getUserLanguage(user: User): Promise<string | undefined> {
    return Languages.findOrCreate({ where: { userID: user.id } })
      .then(i => i[0]?.language);
  }

  getString(user: User, str: string, ...args: any[]): string {
    const lang = this.userLanguages[user.id];
    const langStrs = this.languageStrings[lang as string];

    return langStrs[str] ? util.format(langStrs[str], ...args) : str;
  }

  loadLanguages() {
    const langs = fs.readdirSync(path.join(__dirname, "..", "languages")).map(f => f.replace(".js", ""));

    for (const lang of langs) {
      import(path.join("..", "languages", lang))
        .then(l => self.languageStrings[lang] = l.default);
    }

    this.client.logger.info("Loaded all language files.");
  }
}