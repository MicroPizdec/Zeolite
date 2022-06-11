import { MessageEmbed } from "discord.js-light";
import ZeoliteClient from "../core/ZeoliteClient";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Languages from "../dbModels/Languages";
import Embed from "../core/Embed";

export default class LanguageCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: "language",
      description: "Changes your language or shows a list of them",
      group: "settings",
      options: [
        {
          type: 1,
          name: "get",
          description: "Shows list of available languages and your current language",
        },
        {
          type: 1,
          name: "set",
          description: "Changes your language",
          options: [
            {
              type: 3,
              name: "lang",
              description: "Language",
              required: true,
            },
          ],
        },
      ],
    });
  }

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    const dbLang = await Languages.findOne({ where: { userID: ctx.user?.id } });
    
    if (subcommand == "get") {
      const availableLangs = Object.keys(this.client.localization.languageStrings);

      const embed = new Embed()
        .setTitle(ctx.t("langAvailableLanguages"))
        .setDescription(availableLangs.map(l => `\`${l}\``).join(", "))
        .setAuthor({ name: `${ctx.user?.username}#${ctx.user?.discriminator}`, icon_url: ctx.user?.avatarURL })
        .addField(ctx.t("langYourLanguage"), `\`${dbLang?.language}\``)
        .setColor(ctx.get("embColor"))
      
      await ctx.reply({ embeds: [ embed ], flags: 64 });
    } else {
      const language = ctx.options.getString("lang")!;
      
      if (!Object.keys(this.client.localization.languageStrings).includes(language)) {
        await ctx.reply({ content: ctx.t("langInvalid"), flags: 64 });
      }
      
      await dbLang?.update({ language });
      this.client.localization.userLanguages[ctx.user!.id] = language;
      await ctx.reply({ content: ctx.t("langSuccess", language), flags: 64 });
    }
  }
}