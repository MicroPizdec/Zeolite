import ZeoliteExtension from "../core/ZeoliteExtension";
import ZeoliteContext from "../core/ZeoliteContext";
import Logger, { LoggerLevel } from "../core/Logger";
import {
  GuildChannel,
  InteractionDataOptionsSubCommand,
  InteractionDataOptionsWithValue,
  Guild
} from "eris";
import Embed from "../core/Embed";

let self: CmdLogsExtension;

export default class CmdLogsExtension extends ZeoliteExtension {
  name = "cmdLogs";
  public logger: Logger = new Logger(LoggerLevel.Info, "CmdLogs");

  private parseOptions(ctx: ZeoliteContext): string {
    // я мажу жопу костылями
    let options: string[] = [];

    const subcommand = ctx.options.getSubcommand();
    if (subcommand) {
      options.push(subcommand);
      if (!(ctx.interaction.data.options as (InteractionDataOptionsSubCommand[] | undefined))?.[0].options) return options.join(" ");

      for (const opt of (ctx.interaction.data.options as InteractionDataOptionsWithValue[] | undefined)?.splice(1) || []) {
        options.push(`${opt.name}: ${opt.value}`);
      }
    } else {
      options = (ctx.interaction.data.options as InteractionDataOptionsWithValue[] | undefined || [])?.map(opt => `${opt.name}: ${opt.value}`);
    }

    return options.join(" ");
  }

  private async onCommandSuccess(ctx: ZeoliteContext) {
    self.logger.info(`${ctx.user?.username}#${ctx.user?.discriminator} used /${ctx.commandName} in ${ctx.guild?.name || "bot DM"}`);
    const options = self.parseOptions(ctx);

    const embed = new Embed()
      .setTitle(`Command \`${ctx.commandName}\` used`)
      .setDescription(`/${ctx.commandName} ${options}`)
      .setColor(config.defaultColor || 0x9f00ff)
      .addField("User", `${ctx.user?.username}#${ctx.user?.discriminator} (ID: ${ctx.user?.id})`)
      .addField("Channel", `${(ctx.channel as GuildChannel).name || "Bot DM"} (ID: ${ctx.channel?.id})`)
      
    if (ctx.guild) embed.addField("Guild", `${ctx.guild.name} (ID: ${ctx.guild.id})`);

    await self.client.executeWebhook(config.webhookID!, config.webhookToken!, {
      embeds: [ embed ],
    });
  }

  private async onCommandError(ctx: ZeoliteContext, error: any) {
    self.logger.error(`Error in command ${ctx.commandName}:`);
    console.error(error);

    const errEmbed = new Embed()
      .setTitle(ctx.t("commandError"))
      .setDescription(ctx.t("commandErrorDesc"))
      .setColor(0xed4245)
      .setFooter({ text: "Zeolite © Fishyrene", icon_url: self.client.user.avatarURL });
    
    if (ctx.interaction.acknowledged) {
      await ctx.editReply({ embeds: [ errEmbed ] });
    } else {
      await ctx.reply({ embeds: [ errEmbed ], flags: 64 });
    }

    const options = self.parseOptions(ctx);

    const embed = new Embed()
      .setTitle(`:x: An error occurred while executing command \`${ctx.commandName}\``)
      .setDescription(`/${ctx.commandName} ${options}`)
      .setColor(0xed4245)
      .addField("Error", `\`\`\`${error}\`\`\``)
      .addField("User", `${ctx.user?.username}#${ctx.user?.discriminator} (ID: ${ctx.user?.id})`)
      .addField("Channel", `${(ctx.channel as GuildChannel)?.name} (ID: ${ctx.channel?.id})`)
      .addField("Guild", `${ctx.guild?.name} (ID: ${ctx.guild?.id})`);
    
      await self.client.executeWebhook(config.webhookID!, config.webhookToken!, {
        embeds: [ embed ],
        file: {
          name: "error.txt",
          file: Buffer.from(error.stack, "utf-8"),
        },
      });
  }

  private async onGuildCreate(guild: Guild) {
    self.logger.info(`New server: ${guild.name} (ID: ${guild.id})`);

    const embed = new Embed()
      .setTitle("New server:")
      .setDescription(`${guild.name} (ID: ${guild.id})`)
      .setColor(config.defaultColor || 0x9f00ff)
      .setThumbnail(guild.iconURL as string);
    
    await self.client.executeWebhook(config.webhookID!, config.webhookToken!, {
      embeds: [ embed ],
    });
  }

  private async onGuildDelete(guild: Guild) {
    self.logger.info(`Removed from server: ${guild.name} (ID: ${guild.id})`);
    
    const embed = new Embed()
      .setTitle("Removed from server:")
      .setDescription(`${guild.name} (ID: ${guild.id})`)
      .setColor(config.defaultColor || 0x9f00ff)
      .setThumbnail(guild.iconURL as string);
    
    await self.client.executeWebhook(config.webhookID!, config.webhookToken!, {
      embeds: [ embed ],
    });
  }

  public async onLoad() {
    if (!config.webhookID || !config.webhookToken) {
      return this.logger.warn("Webhook ID and/or token are missing.");
    }

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