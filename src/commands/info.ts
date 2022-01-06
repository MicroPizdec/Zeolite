import { MessageEmbed, User } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class InfoCommand extends ZeoliteCommand {
  name = "info";
  description = "Information about bot";

  async run(ctx: ZeoliteContext) {
    const link = this.client.generateInvite({ scopes: [ "bot", "applications.commands" ] });

    const devIds = [ "800053727988809748", "412503784455929857", "330153333962702850" ];
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
      .setColor(0x9f00ff)
      .addField(ctx.t("infoDevs"), devs.map(d => d?.tag).join(", "))
      .addField(ctx.t("infoLinks"), `[${ctx.t("infoInvite")}](${link})\n` +
      `[${ctx.t("infoSupportServer")}](https://discord.gg/ZKChwBD)\n` + 
      `[${ctx.t("infoRepository")}](https://github.com/MicroPizdec/Zeolite)\n` +
      `[${ctx.t("infoDonate")}](https://www.donationalerts.com/r/fishyrene)\n`);
    
    await ctx.reply({ embeds: [ embed ] });
  }
}