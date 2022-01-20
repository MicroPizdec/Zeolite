import { MessageEmbed, Role } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import intToHex from "../utils/intToHex";

export default class RoleCommand extends ZeoliteCommand {
  name = "role";
  description = "Information about role";
  options = [
    {
      type: 8,
      name: "role",
      description: "A role",
      required: true,
    },
  ];

  async run(ctx: ZeoliteContext) {
    const role = ctx.options.getRole("role", true) as Role;

    const createdDays = Math.floor((Date.now() - role.createdTimestamp) / (86400 * 1000));

    const embed = new MessageEmbed()
      .setTitle(role.name)
      .setColor(role.color || await ctx.embColor())
      .addField("ID", role.id)
      .addField(ctx.t("roleCreatedAt"), `<t:${Math.floor(role.createdTimestamp / 1000)}> ${ctx.t("daysAgo", createdDays)}`)
      .addField(ctx.t("roleHoisted"), role.hoist ? ctx.t("payYes") : ctx.t("payNo"))
      .addField(ctx.t("roleManaged"), role.managed ? ctx.t("payYes") : ctx.t("payNo")) 
      .addField(ctx.t("roleColor"), role.color ? `#${intToHex(role.color)}` : ctx.t("roleColorDefault"))
      .setFooter({ text: "Zeolite © Fishyrene", iconURL: this.client.user?.displayAvatarURL() }); // ну поiхали
    
    await ctx.reply({ embeds: [ embed ] });
  }
}