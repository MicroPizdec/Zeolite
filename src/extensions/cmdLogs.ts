import { ZeoliteExtension, LoggerLevel, Embed, ZeoliteContext } from 'zeolitecore';
import { Guild, GuildChannel, InteractionOptionsSubCommand, InteractionOptionsWithValue } from 'oceanic.js';
import { getLogger, Logger } from 'log4js';

let self: CmdLogsExtension;

export default class CmdLogsExtension extends ZeoliteExtension {
  name = 'cmdLogs';
  public logger: Logger = getLogger('CmdLogs');

  private parseOptions(ctx: ZeoliteContext): string {
    // я мажу жопу костылями
    let options: string[] = [];

    const subcommand = ctx.options.getSubCommand()?.[0];
    if (subcommand) {
      options.push(subcommand);
      if (!(ctx.options.raw as InteractionOptionsSubCommand[])[0].options?.length) {
        return options.join(' ');
      }

      for (const opt of (ctx.options.raw as InteractionOptionsSubCommand[])[0].options!) {
        options.push(`${opt.name}: ${opt.value}`);
      }
    } else {
      options = (ctx.options.raw as InteractionOptionsWithValue[]).map((opt) => `${opt.name}: ${opt.value}`);
    }

    /*const subcommand = ctx.options.getSubcommand();
    if (subcommand) {
      options.push(subcommand);
      if (!(ctx.interaction.data.options as InteractionDataOptionsSubCommand[] | undefined)?.[0].options)
        return options.join(' ');

      for (const opt of ((ctx.interaction.data.options as InteractionDataOptionsSubCommand[] | undefined)?.[0]
        .options as InteractionDataOptionsWithValue[]) || []) {
        options.push(`${opt.name}: ${opt.value}`);
      }
    } else {
      options = ((ctx.interaction.data.options as InteractionDataOptionsWithValue[] | undefined) || [])?.map(
        (opt) => `${opt.name}: ${opt.value}`,
      );
    }*/

    return options.join(' ');
  }

  private async onCommandSuccess(ctx: ZeoliteContext) {
    self.logger.info(
      `${ctx.user?.username}#${ctx.user?.discriminator} used /${ctx.commandName} in ${ctx.guild?.name || 'bot DM'}`,
    );

    if (!config.webhookID || !config.webhookToken) return;
    const options = self.parseOptions(ctx);

    const embed = new Embed()
      .setTitle(`Command \`${ctx.commandName}\` used`)
      .setDescription(`/${ctx.commandName} ${options}`)
      .setColor(config.defaultColor || 0x9f00ff)
      .addField('User', `${ctx.user?.username}#${ctx.user?.discriminator} (ID: ${ctx.user?.id})`)
      .addField('Channel', `${(ctx.channel as GuildChannel).name || 'Bot DM'} (ID: ${ctx.channel?.id})`);

    if (ctx.guild) embed.addField('Guild', `${ctx.guild.name} (ID: ${ctx.guild.id})`);

    await self.client.executeWebhook(config.webhookID, config.webhookToken, {
      embeds: [embed],
    });
  }

  private async onCommandError(ctx: ZeoliteContext, error: any) {
    if (!config.webhookID || !config.webhookToken) return;

    const errEmbed = new Embed()
      .setTitle(ctx.t('commandError'))
      .setDescription(ctx.t('commandErrorDesc'))
      .setColor(0xed4245)
      .setFooter({
        text: 'Zeolite © Fishyrene',
        iconURL: self.client.user.avatarURL(),
      });

    if (ctx.interaction.acknowledged) {
      await ctx.editReply({ embeds: [errEmbed] });
    } else {
      await ctx.reply({ embeds: [errEmbed], flags: 64 });
    }

    const options = self.parseOptions(ctx);

    const embed = new Embed()
      .setTitle(`:x: An error occurred while executing command \`${ctx.commandName}\``)
      .setDescription(`/${ctx.commandName} ${options}`)
      .setColor(0xed4245)
      .addField('Error', `\`\`\`${error}\`\`\``)
      .addField('User', `${ctx.user?.username}#${ctx.user?.discriminator} (ID: ${ctx.user?.id})`)
      .addField('Channel', `${(ctx.channel as GuildChannel)?.name} (ID: ${ctx.channel?.id})`)
      .addField('Guild', `${ctx.guild?.name} (ID: ${ctx.guild?.id})`);

    await self.client.executeWebhook(config.webhookID!, config.webhookToken!, {
      embeds: [embed],
      files: [
        {
          name: 'error.txt',
          contents: Buffer.from(error.stack, 'utf-8'),
        },
      ],
    });
  }

  private async onGuildCreate(guild: Guild) {
    self.logger.info(`New server: ${guild.name} (ID: ${guild.id})`);

    if (!config.webhookID || !config.webhookToken) return;

    const embed = new Embed()
      .setTitle('New server:')
      .setDescription(`${guild.name} (ID: ${guild.id})`)
      .setColor(config.defaultColor || 0x9f00ff)
      .setThumbnail(guild.iconURL()!);

    await self.client.executeWebhook(config.webhookID!, config.webhookToken!, {
      embeds: [embed],
    });
  }

  private async onGuildDelete(guild: Guild) {
    self.logger.info(`Removed from server: ${guild.name} (ID: ${guild.id})`);

    if (!config.webhookID || !config.webhookToken) return;

    const embed = new Embed()
      .setTitle('Removed from server:')
      .setDescription(`${guild.name} (ID: ${guild.id})`)
      .setColor(config.defaultColor || 0x9f00ff)
      .setThumbnail(guild.iconURL()!);

    await self.client.executeWebhook(config.webhookID!, config.webhookToken!, {
      embeds: [embed],
    });
  }

  public async onLoad() {
    if (!config.webhookID || !config.webhookToken) {
      return this.logger.warn('Webhook ID and/or token are missing.');
    }

    self = this;

    this.client.on('commandSuccess', this.onCommandSuccess);
    this.client.on('commandError', this.onCommandError);
    this.client.on('guildCreate', this.onGuildCreate);
    this.client.on('guildDelete', this.onGuildDelete);
  }

  public async onUnload() {
    this.client.off('commandSuccess', this.onCommandSuccess);
    this.client.off('commandError', this.onCommandError);
    this.client.off('guildCreate', this.onGuildCreate);
    this.client.off('guildDelete', this.onGuildDelete);
  }
}
