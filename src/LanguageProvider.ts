import { ZeoliteContext, ZeoliteLanguageProvider } from "zeolitecore";
import Languages from "./dbModels/Languages";

export default class LanguageProvider implements ZeoliteLanguageProvider {
  private localesCache: Record<string, string | undefined> = {};

  public async getUserLanguage(ctx: ZeoliteContext): Promise<string | undefined> {
    if (!this.localesCache[ctx.user.id]) {
      const lang = await Languages.findOrCreate({ where: { userID: ctx.user.id } })
        .then(l => l[0]);

      if (lang.langChanged) {
        this.localesCache[ctx.user.id] = lang.language;
      } else {
        this.localesCache[ctx.user.id] = ctx.interaction.locale;
      }
    }

    return this.localesCache[ctx.user.id];
  }

  public async updateUserLanguage(userID: string, lang: string): Promise<any> {
    const item = await Languages.findOne({ where: { userID } });
    if (item) {
      await item.update({ language: lang, langChanged: true });
      this.localesCache[userID] = lang;
    }
  }

  public async deleteUserLanguage(userID: string): Promise<any> {
    const item = await Languages.findOne({ where: { userID } });
    if (item) {
      await item.update({ language: null, langChanged: false });
      this.localesCache[userID] = undefined;
    }
  }
}