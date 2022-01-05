import { MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Languages from "../dbModels/Languages";

export default class LanguageCommand extends ZeoliteCommand {
  name = "language";
  description = "Changes your language or shows a list of them";
  options = [
    {
      type: 3,
      name: "lang",
      description: "Language",
      required: false,
    }
  ];

  async run(ctx: ZeoliteContext) {
    let language = ctx.interaction.options.getString("language");
    let dbLang = await Languages.findOne({ where: { userID: ctx.user.id } });
    
    if (!language) {
      const availableLangs = Object.keys(this.client.localization.languageStrings);

      const embed = new MessageEmbed()
        .setTitle(ctx.t("langAvailableLanguages"))
        .setDescription(availableLangs.map(l => `\`${l}\``).join(", "))
        .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL() })
        .addField(ctx.t("langYourLanguage"), `\`${dbLang?.language}\``)
        .setColor(0x9f00ff)
      
      await ctx.reply({ embeds: [ embed ], ephemeral: true });
    } else {
      if (!["en", "ru"].includes(language)) {
        await ctx.reply({ content: ctx.t("langInvalid"), ephemeral: true });
      }
      
      await dbLang?.update({ language });
      await ctx.reply({ content: ctx.t("langSuccess", language), ephemeral: true });
    }
  }
}