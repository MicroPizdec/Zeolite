import ZeoliteExtension from "../core/ZeoliteExtension";
import ZeoliteContext from "../core/ZeoliteContext";

export default class EventsExtension extends ZeoliteExtension {
  name = "events";

  private async ownerOnlyCommand(ctx: ZeoliteContext) {
    await ctx.reply({ content: ctx.t("notBotOwner"), ephemeral: true });
  }
  
  private async commandCooldown(ctx: ZeoliteContext, secsLeft: number) {
    await ctx.reply({ content: ctx.t("cooldown", secsLeft), ephemeral: true });
  }
  
  private async guildOnlyCommand(ctx: ZeoliteContext) {
    await ctx.reply({ content: ctx.t("guildOnlyCommand"), ephemeral: true });
  }
  
  private async noPermissions(ctx: ZeoliteContext, permissions: string[]) {
    await ctx.reply({ content: ctx.t("noPermissions", permissions.join()), ephemeral: true });
  }

  public onLoad() {
    this.client.on("ownerOnlyCommand", this.ownerOnlyCommand);
    this.client.on("commandCooldown", this.commandCooldown);
    this.client.on("guildOnlyCommand", this.guildOnlyCommand);
    this.client.on("noPermissions", this.noPermissions);
  }

  public onUnload() {
    this.client.off("ownerOnlyCommand", this.ownerOnlyCommand);
    this.client.off("commandCooldown", this.commandCooldown);
    this.client.off("guildOnlyCommand", this.guildOnlyCommand);
    this.client.off("noPermissions", this.noPermissions);
  }
}