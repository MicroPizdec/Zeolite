import { MessageEmbed, User, MessageActionRow, MessageButton } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class InfoCommand extends ZeoliteCommand {
  name = "info";
  description = "Information about bot";
  group = "general";

  async run(ctx: ZeoliteContext) {
    const link = this.client.generateInvite({ scopes: [ "bot", "applications.commands" ] });

    const devIds: string[] = [ "800053727988809748", "527725849575686145", "330153333962702850" ];
    const devs: (User | undefined)[] = [];
    for (const id of devIds) {
      const user = this.client.users.cache.has(id) ?
        this.client.users.cache.get(id) :
        await this.client.users.fetch(id).catch(() => {});
      
      if (user) devs.push(user);
    }

    const embed = new MessageEmbed()
      .setTitle(ctx.t("infoTitle"))
      .setDescription(ctx.t("infoDesc"))
      .setColor(ctx.get("embColor"))
      .addField(ctx.t("infoDevs"), devs.map(d => d?.tag).join(", "));

    const actionRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel(ctx.t("infoInvite"))
          .setStyle("LINK")
          .setURL(link),
        new MessageButton()
          .setLabel(ctx.t("infoSupportServer"))
          .setStyle("LINK")
          .setURL("https://discord.gg/ZKChwBD"),
        new MessageButton()
          .setLabel(ctx.t("infoRepository"))
          .setStyle("LINK")
          .setURL("https://github.com/MicroPizdec/Zeolite"),
        new MessageButton()
          .setLabel(ctx.t("infoDonate"))
          .setStyle("LINK")
          .setURL("https://www.donationalerts.com/r/fishyrene")
      );
    
    await ctx.reply({ embeds: [ embed ], components: [ actionRow ] });
  }
}