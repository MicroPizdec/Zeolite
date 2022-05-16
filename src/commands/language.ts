import { MessageEmbed } from "discord.js-light";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Languages from "../dbModels/Languages";

export default class LanguageCommand extends ZeoliteCommand {
  name = "language";
  description = "Changes your language or shows a list of them";
  group = "settings";
  options = [
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
  ];

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    const dbLang = await Languages.findOne({ where: { userID: ctx.user.id } });
    
    if (subcommand == "get") {
      const availableLangs = Object.keys(this.client.localization.languageStrings);

      const embed = new MessageEmbed()
        .setTitle(ctx.t("langAvailableLanguages"))
        .setDescription(availableLangs.map(l => `\`${l}\``).join(", "))
        .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
        .addField(ctx.t("langYourLanguage"), `\`${dbLang?.language}\``)
        .setColor(ctx.get("embColor"))
      
      await ctx.reply({ embeds: [ embed ], ephemeral: true });
    } else {
      const language = ctx.options.getString("lang", true);
      
      if (!["en", "ru"].includes(language)) {
        await ctx.reply({ content: ctx.t("langInvalid"), ephemeral: true });
      }
      
      await dbLang?.update({ language });
      this.client.localization.userLanguages[ctx.user.id] = language;
      await ctx.reply({ content: ctx.t("langSuccess", language), ephemeral: true });
    }
  }
}