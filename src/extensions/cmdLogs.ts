import { GuildChannel, MessageEmbed, WebhookClient } from "discord.js-light";
import ZeoliteExtension from "../core/ZeoliteExtension";
import ZeoliteContext from "../core/ZeoliteContext";

let self: CmdLogsExtension;

export default class CmdLogsExtension extends ZeoliteExtension {
  name = "cmdLogs";
  webhook: WebhookClient;

  parseOptions(ctx: ZeoliteContext): string {
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

  async onCommandSuccess(ctx: ZeoliteContext) {
    const options = self.parseOptions(ctx);

    const embed = new MessageEmbed()
      .setTitle(`Command \`${ctx.commandName}\` used`)
      .setDescription(`/${ctx.commandName} ${options}`)
      .setColor(0x9f00ff)
      .addField("User", `${ctx.user.tag} (ID: ${ctx.user.id})`)
      .addField("Channel", `${(ctx.channel as GuildChannel)?.name} (ID: ${ctx.channel?.id})`)
      .addField("Guild", `${ctx.guild?.name} (ID: ${ctx.guild?.id})`);

    await self.webhook.send({ embeds: [ embed ] });
  }

  async onCommandError(ctx: ZeoliteContext, error: any) {
    const errEmbed = new MessageEmbed()
      .setTitle(ctx.t("commandError"))
      .setDescription(ctx.t("commandErrorDesc"))
      .setColor("RED")
      .setFooter("Zeolite © Fishyrene", self.client.user?.displayAvatarURL());
    
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
    
    await self.webhook.send({ embeds: [ embed ] });
  }

  async onLoad() {
    if (config.webhookUrl) this.webhook = new WebhookClient({ url: config.webhookUrl });

    self = this;

    this.client.on("commandSuccess", this.onCommandSuccess);
    this.client.on("commandError", this.onCommandError);
  }

  async onUnload() {
    this.client.off("commandSuccess", this.onCommandSuccess);
    this.client.off("commandError", this.onCommandError);
  }
}