import ZeoliteExtension from "../core/ZeoliteExtension";
import ZeoliteContext from "../core/ZeoliteContext";

export default class EventsExtension extends ZeoliteExtension {
  name = "events";

  async ownerOnlyCommand(ctx: ZeoliteContext) {
    await ctx.reply({ content: ctx.t("notBotOwner"), ephemeral: true });
  }
  
  async commandCooldown(ctx: ZeoliteContext, secsLeft: number) {
    await ctx.reply({ content: ctx.t("cooldown", secsLeft), ephemeral: true });
  }
  
  async guildOnlyCommand(ctx: ZeoliteContext) {
    await ctx.reply({ content: ctx.t("guildOnlyCommand"), ephemeral: true });
  }
  
  async noPermissions(ctx: ZeoliteContext, permissions: string[]) {5
    await ctx.reply({ content: ctx.t("noPermissions", permissions.join()), ephemeral: true });
  }

  onLoad() {
    this.client.on("ownerOnlyCommand", this.ownerOnlyCommand);
    this.client.on("commandCooldown", this.commandCooldown);
    this.client.on("guildOnlyCommand", this.guildOnlyCommand);
    this.client.on("noPermissions", this.noPermissions);
  }

  onUnload() {
    this.client.off("ownerOnlyCommand", this.ownerOnlyCommand);
    this.client.off("commandCooldown", this.commandCooldown);
    this.client.off("guildOnlyCommand", this.guildOnlyCommand);
    this.client.off("noPermissions", this.noPermissions);
  }
}