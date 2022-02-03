import { MessageEmbed, User, GuildMember, ApplicationCommandOptionData } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Warns from "../dbModels/Warns";

export default class WarnCommand extends ZeoliteCommand {
  name = "warn";
  description = "юзлесс все равно у нас субкоманды будут";
  group = "moderation";
  options = [
    {
      type: 1,
      name: "add",
      description: "Adds a warn to provided user. Requires the Kick Members permission",
      options: [
        {
          type: 6,
          name: "user",
          description: "User",
          required: true,
        },
        {
          type: 3,
          name: "reason",
          description: "Warn reason",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "delete",
      description: "Deletes a warn by its ID. Requires the Kick Members permission.",
      options: [
        {
          type: 3,
          name: "id",
          description: "Warn ID",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "get",
      description: "Shows user warns.",
      options: [
        {
          type: 6,
          name: "user",
          description: "User",
          required: false,
        },
      ],
    },
  ];
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    switch (subcommand) {
      case "add": {
        if (!ctx.member.permissions.has("KICK_MEMBERS")) {
          this.client.emit("noPermissions", ctx, [ "KICK_MEMBERS" ]);
          return;
        }
        
        const member = ctx.options.getMember("user", true) as GuildMember; 
        const reason = ctx.options.getString("reason");

        if (member.user.id == ctx.user.id) {
          await ctx.reply({ content: ctx.t("cantWarnYourself"), ephemeral: true });
          return;
        }

        if (member.user.bot) {
          await ctx.reply({ content: ctx.t("cantWarnBot"), ephemeral: true });
          return;
        }

        if ([...ctx.member.roles.cache.values()][0].rawPosition > [...member.roles.cache.values()][0].rawPosition) {
          await ctx.reply({ content: ctx.t("warnRoleHigher"), ephemeral: true })
          return;
        }

        const warns = await Warns.findAll({ where: { userID: member.user.id, guildID: ctx.guild!.id } });

        if (warns.length >= 10) {
          await ctx.reply({ content: ctx.t("warnLimit"), ephemeral: true });
          return;
        }

        const warn = await Warns.create({
          guildID: ctx.guild!.id,
          userID: member.user.id,
          moderatorID: ctx.user.id,
          reason,
        });
        
        const embed = new MessageEmbed()
          .setAuthor({ name: ctx.t("warnAdded", member.user.tag), iconURL: member.user.displayAvatarURL() })
          .setDescription(ctx.t("reason", reason || ctx.t("reasonNone")))
          .setFooter({ text: ctx.t("warnID", warn.id) })
          .setTimestamp(new Date())
          .setColor("GREEN");

        await ctx.reply({ embeds: [ embed ] });
        break;
      }

      case "delete": {
        if (!ctx.member.permissions.has("KICK_MEMBERS")) {
          this.client.emit("noPermissions", ctx, [ "KICK_MEMBERS" ]);
          return;
        }

        const warnID = ctx.options.getString("id", true);

        const warn = await Warns.findOne({ where: { guildID: ctx.guild!.id, id: warnID } });

        if (!warn) {
          await ctx.reply({ content: ctx.t("warnInvalidID"), ephemeral: true });
          return;
        }

        await warn.destroy();

        await ctx.reply({ content: ctx.t("warnDeleted", warn.id), ephemeral: true });
        break;
      }

      case "get": {
        const member = ctx.options.getMember("user", false) as GuildMember || ctx.member;
        
        const warnlist = await Warns.findAll({ where: { userID: member.user.id, guildID: ctx.guild!.id } });
        
        const embed = new MessageEmbed()
          .setAuthor({ name: ctx.t("warnList", member.user.tag), iconURL: member.user.displayAvatarURL() })
          .setColor(ctx.get("embColor"))
          .setFooter({ text: ctx.t("warnCount", warnlist.length) });

        for (const warn of warnlist) {
          const mod = await this.client.users.fetch(warn.moderatorID);

          embed.addField(ctx.t("warnField", warn.id, mod.tag), ctx.t("reason", warn.reason || ctx.t("reasonNone")));
        }

        await ctx.reply({ embeds: [ embed ] });
        break;
      }
    }
  }
}