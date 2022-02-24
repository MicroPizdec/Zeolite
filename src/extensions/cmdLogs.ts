import { GuildChannel, MessageEmbed, WebhookClient, Guild } from "discord.js";
import ZeoliteExtension from "../core/ZeoliteExtension";
import ZeoliteContext from "../core/ZeoliteContext";
import Logger, { LoggerLevel } from "../core/Logger";

let self: CmdLogsExtension;

export default class CmdLogsExtension extends ZeoliteExtension {
  name = "cmdLogs";
  public webhook?: WebhookClient;
  public logger: Logger = new Logger(LoggerLevel.Info, "CmdLogs");

  private parseOptions(ctx: ZeoliteContext): string {
    let options: string[] = [];

    const subcommand = ctx.interaction.options.getSubcommand(false);
    if (subcommand) {
      options.push(subcommand);
      if (!ctx.interaction.options.data[0].options) return options.join(" ");

      for (const opt of ctx.interaction.options.data[0].options) {
        options.push(`${opt.name}: ${opt.value}`);
      }
    } else {
      options = ctx.interaction.options.data.map(opt => `${opt.name}: ${opt.value}`);
    }

    return options.join(" ");
  }

  private async onCommandSuccess(ctx: ZeoliteContext) {
    self.logger.info(`${ctx.user.tag} used /${ctx.commandName} in ${ctx.guild?.name || "bot DM"}`);
    const options = self.parseOptions(ctx);

    const embed = new MessageEmbed()
      .setTitle(`Command \`${ctx.commandName}\` used`)
      .setDescription(`/${ctx.commandName} ${options}`)
      .setColor(config.defaultColor || 0x9f00ff)
      .addField("User", `${ctx.user.tag} (ID: ${ctx.user.id})`)
      .addField("Channel", `${(ctx.channel as GuildChannel)?.name} (ID: ${ctx.channel?.id})`)
      .addField("Guild", `${ctx.guild?.name} (ID: ${ctx.guild?.id})`);

    await self.webhook?.send({ embeds: [ embed ] });
  }

  private async onCommandError(ctx: ZeoliteContext, error: any) {
    self.logger.error(`Error in command ${ctx.commandName}:`);
    console.error(error);

    const errEmbed = new MessageEmbed()
      .setTitle(ctx.t("commandError"))
      .setDescription(ctx.t("commandErrorDesc"))
      .setColor("RED")
      .setFooter({ text: "Zeolite © Fishyrene", iconURL: self.client.user?.displayAvatarURL() });
    
    if (ctx.interaction.deferred) {
      await ctx.editReply({ embeds: [ errEmbed ] });
    } else {
      await ctx.reply({ embeds: [ errEmbed ], ephemeral: true });
    }

    const options = self.parseOptions(ctx);

    const embed = new MessageEmbed()
      .setTitle(`:x: An error occurred while executing command \`${ctx.commandName}\``)
      .setDescription(`/${ctx.commandName} ${options}`)
      .setColor("RED")
      .addField("Error", `\`\`\`${error}\`\`\``)
      .addField("User", `${ctx.user.tag} (ID: ${ctx.user.id})`)
      .addField("Channel", `${(ctx.channel as GuildChannel)?.name} (ID: ${ctx.channel?.id})`)
      .addField("Guild", `${ctx.guild?.name} (ID: ${ctx.guild?.id})`);
    
    await self.webhook?.send({ embeds: [ embed ] });
  }

  private async onGuildCreate(guild: Guild) {
    const embed = new MessageEmbed()
      .setTitle("New server:")
      .setDescription(`${guild.name} (ID: ${guild.id})`)
      .setColor(config.defaultColor || 0x9f00ff)
      .setThumbnail(guild.iconURL() as string);
    
    await self.webhook?.send({ embeds: [ embed ]});
  }

  private async onGuildDelete(guild: Guild) {
    const embed = new MessageEmbed()
      .setTitle("Removed from server:")
      .setDescription(`${guild.name} (ID: ${guild.id})`)
      .setColor(config.defaultColor || 0x9f00ff)
      .setThumbnail(guild.iconURL() as string);
    
    await self.webhook?.send({ embeds: [ embed ]});
  }

  public async onLoad() {
    if (!config.webhookUrl) {
      return this.logger.warn("Webhook URL is missing.");
    } 
    
    this.webhook = new WebhookClient({ url: config.webhookUrl });

    self = this;

    this.client.on("commandSuccess", this.onCommandSuccess);
    this.client.on("commandError", this.onCommandError);
    this.client.on("guildCreate", this.onGuildCreate);
    this.client.on("guildDelete", this.onGuildDelete);
  }

  public async onUnload() {
    this.client.off("commandSuccess", this.onCommandSuccess);
    this.client.off("commandError", this.onCommandError);
    this.client.off("guildCreate", this.onGuildCreate);
    this.client.off("guildDelete", this.onGuildDelete);
  }
}