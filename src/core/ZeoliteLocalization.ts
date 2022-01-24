import ZeoliteClient from "./ZeoliteClient";
import Languages from "../dbModels/Languages";
import { User } from "discord.js-light";
import fs from "fs";
import path from "path";
import util from "util";

let self: ZeoliteLocalization;

export default class ZeoliteLocalization {
  languageStrings: Record<string, Record<string, string>> = {};
  userLanguages: Record<string, string | undefined> = {};
  readonly client: ZeoliteClient;
  
  constructor(client: ZeoliteClient) {
    this.client = client;
    self = this;

    this.client.addBeforeCommandHook(async ctx => {
      if (!self.userLanguages[ctx.user.id]) {
        self.userLanguages[ctx.user.id] = await self.getUserLanguage(ctx.user);
      }

      return true;
    });
  }

  async getUserLanguage(user: User): Promise<string | undefined> {
    return Languages.findOrCreate({ where: { userID: user.id } })
      .then(i => i[0]?.language);
  }

  getString(user: User, str: string, ...args: any[]): string {
    const lang = this.userLanguages[user.id];
    const langStrs = this.languageStrings[lang as string];

    return langStrs[str] ? util.format(langStrs[str], ...args) : `${str} ${args.join(" ")}`;
  }

  loadLanguages() {
    const langs = fs.readdirSync(path.join(__dirname, "..", "languages")).map(i => i.split(".")[0]);

    for (const lang of langs) {
      import(path.join("..", "languages", lang))
        .then(l => self.languageStrings[lang] = l.default);
    }

    this.client.logger.info("Loaded all language files.");
  }
}