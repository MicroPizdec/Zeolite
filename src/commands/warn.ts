import { Guild } from 'eris';
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import Warns from '../dbModels/Warns';

export default class WarnCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'warn',
      description: 'юзлесс все равно у нас субкоманды будут',
      group: 'moderation',
      options: [
        {
          type: 1,
          name: 'add',
          description: 'Adds a warn to provided user. Requires the Kick Members permission',
          options: [
            {
              type: 6,
              name: 'user',
              description: 'User',
              required: true,
            },
            {
              type: 3,
              name: 'reason',
              description: 'Warn reason',
              required: false,
            },
          ],
        },
        {
          type: 1,
          name: 'delete',
          description: 'Deletes a warn by its ID. Requires the Kick Members permission.',
          options: [
            {
              type: 3,
              name: 'id',
              description: 'Warn ID',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'get',
          description: 'Shows user warns.',
          options: [
            {
              type: 6,
              name: 'user',
              description: 'User',
              required: false,
            },
          ],
        },
      ],
      guildOnly: true,
    });
  }

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    switch (subcommand) {
      case 'add': {
        if (!ctx.member!.permissions.has('kickMembers')) {
          this.client.emit('noPermissions', ctx, ['kickMembers']);
          return;
        }

        const member = ctx.options.getMember('user')!;
        const reason = ctx.options.getString('reason');

        if (member.id == ctx.user!.id) {
          await ctx.reply({
            content: ctx.t('cantWarnYourself'),
            flags: 64,
          });
          return;
        }

        if (member.bot) {
          await ctx.reply({ content: ctx.t('cantWarnBot'), flags: 64 });
          return;
        }

        if (
          this.getRolePosition(ctx.guild!, ctx.member!.roles[0])! > this.getRolePosition(ctx.guild!, member.roles[0])!
        ) {
          await ctx.reply({
            content: ctx.t('warnRoleHigher'),
            flags: 64,
          });
          return;
        }

        const warns = await Warns.findAll({
          where: { userID: member.id, guildID: ctx.guild!.id },
        });

        if (warns.length >= 10) {
          await ctx.reply({ content: ctx.t('warnLimit'), flags: 64 });
          return;
        }

        const warn = await Warns.create({
          guildID: ctx.guild!.id,
          userID: member.id,
          moderatorID: ctx.user!.id,
          reason,
        });

        const embed = new Embed()
          .setAuthor({
            name: ctx.t('warnAdded', `${member.username}#${member.discriminator}`),
            icon_url: member.avatarURL,
          })
          .setDescription(ctx.t('reason', reason || ctx.t('reasonNone')))
          .setFooter({ text: ctx.t('warnID', warn.id) })
          .setTimestamp(new Date().toISOString())
          .setColor(0x57f287);

        await ctx.reply({ embeds: [embed] });
        break;
      }

      case 'delete': {
        if (!ctx.member!.permissions.has('kickMembers')) {
          this.client.emit('noPermissions', ctx, ['kickMembers']);
          return;
        }

        const warnID = ctx.options.getString('id')!;

        const warn = await Warns.findOne({
          where: { guildID: ctx.guild!.id, id: warnID },
        });

        if (!warn) {
          await ctx.reply({ content: ctx.t('warnInvalidID'), flags: 64 });
          return;
        }

        await warn.destroy();

        await ctx.reply({
          content: ctx.t('warnDeleted', warn.id),
          flags: 64,
        });
        break;
      }

      case 'get': {
        const member = ctx.options.getMember('user') || ctx.member;

        const warnlist = await Warns.findAll({
          where: { userID: member!.id, guildID: ctx.guild!.id },
        });

        const embed = new Embed()
          .setAuthor({
            name: ctx.t('warnList', `${member!.username}#${member!.discriminator}`),
            icon_url: member!.avatarURL,
          })
          .setColor(ctx.get('embColor'))
          .setFooter({ text: ctx.t('warnCount', warnlist.length) });

        for (const warn of warnlist) {
          const mod = await (this.client.users.get(warn.moderatorID) || this.client.getRESTUser(warn.moderatorID));

          embed.addField(
            ctx.t('warnField', warn.id, `${mod.username}#${mod.discriminator}`),
            ctx.t('reason', warn.reason || ctx.t('reasonNone')),
          );
        }

        await ctx.reply({ embeds: [embed] });
        break;
      }
    }
  }

  private getRolePosition(guild: Guild, roleID: string): number | undefined {
    return guild.roles.get(roleID)?.position;
  }
}
