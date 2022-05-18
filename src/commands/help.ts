import { MessageEmbed } from "discord.js-light";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class HelpCommand extends ZeoliteCommand {
  name = "help";
  description = "Help! I'm stuck!";
  group = "general";

  async run(ctx: ZeoliteContext) { 
    const embed = new MessageEmbed()
      .setTitle(ctx.t("commands"))
      .setDescription(ctx.t("helpDesc"))
      .addField(ctx.t("generalGroup"), this.client.commands.filter(c => c.group == "general").map(c => `\`${c.name}\``).join(", "))
      .addField(ctx.t("economyGroup"), this.client.commands.filter(c => c.group == "economy").map(c => `\`${c.name}\``).join(", "))
      .addField(ctx.t("musicGroup"), this.client.commands.filter(c => c.group == "music").map(c => `\`${c.name}\``).join(", "))
      //.addField(ctx.t("funGroup"), this.client.commands.filter(c => c.group == "fun").map(c => `\`${c.name}\``).join(", "))
      .addField(ctx.t("otherGroup"), this.client.commands.filter(c => c.group == "other").map(c => `\`${c.name}\``).join(", "))
      .addField(ctx.t("moderationGroup"), this.client.commands.filter(c => c.group == "moderation").map(c => `\`${c.name}\``).join(", "))
      .addField(ctx.t("settingsGroup"), this.client.commands.filter(c => c.group == "settings").map(c => `\`${c.name}\``).join(", "))
      .addField(ctx.t("devGroup"), this.client.commands.filter(c => c.group == "dev").map(c => `\`${c.name}\``).join(", "))
      .setColor(ctx.get("embColor"))
      .setFooter({ text: "Zeolite © Fishyrene", iconURL: this.client.user?.displayAvatarURL() });

    await ctx.reply({ embeds: [ embed ] });
  }
}