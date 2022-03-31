import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js-light";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class AvatarCommand extends ZeoliteCommand {
  name = "avatar";
  description = "Shows user's avatar";
  group = "general";
  options = [
    {
      type: 1,
      name: "user",
      description: "Shows an user's avatar",
      options: [
        {
          type: 6,
          name: "user",
          description: "A user. Default is you",
          required: false,
        },
        {
          type: 5,
          name: "forceuseravatar",
          description: "Whether the user's avatar will be shown instead of server avatar",
          required: false,
        }
      ],
    },
    {
      type: 1,
      name: "server",
      description: "Shows a server icon",
    },
    {
      type: 1,
      name: "banner",
      description: "Shows a server banner",
    },
  ];

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.interaction.options.getSubcommand();

    switch (subcommand) {
      case "user": {
        const user = ctx.interaction.options.getUser("user") || ctx.user;
        const member = await ctx.getOrFetchMember(user.id);
        const forceUserAvatar = ctx.options.getBoolean("forceuseravatar") || false;

        const dynamic = member!.avatar?.startsWith("a_") || user.avatar?.startsWith("a_");
        const url = forceUserAvatar ? user.displayAvatarURL({ dynamic, size: 2048 })
          : member!.displayAvatarURL({ dynamic, size: 2048 });

        const linkButton = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setLabel(ctx.t("avatarURL"))
              .setStyle('LINK')
              .setURL(url)
          );

        const embed = new MessageEmbed()
          .setAuthor({ name: ctx.t("avatarTitle", user.tag) })
          .setColor(ctx.get("embColor"))
          .setImage(url);
    
        await ctx.reply({ embeds: [ embed ], components: [ linkButton ] });
        break;
      }

      case "server": {
        const dynamic = ctx.guild?.icon?.startsWith("a_");
        const url = ctx.guild?.iconURL({ size: 2048, dynamic });

        if (!url) {
          await ctx.reply({ content: ctx.t("avatarNoServerIcon"), ephemeral: true });
          return;
        }

        const embed = new MessageEmbed()
          .setAuthor({ name: ctx.t("avatarServerIcon") })
          .setColor(ctx.get("embColor"))
          .setImage(url);
        
        const actionRow = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setLabel(ctx.t("avatarIconURL"))
              .setStyle("LINK")
              .setURL(url)
          );
        
        await ctx.reply({ embeds: [ embed ], components: [ actionRow ] });
        break;
      }

      case "banner": {
        const url = ctx.guild?.bannerURL();

        if (!url) {
          await ctx.reply({ content: ctx.t("avatarNoBanner"), ephemeral: true });
          return;
        }

        const embed = new MessageEmbed()
          .setAuthor({ name: ctx.t("avatarBanner") })
          .setColor(ctx.get("embColor"))
          .setImage(url);
        
        const actionRow = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setLabel(ctx.t("avatarBannerURL"))
              .setStyle("LINK")
              .setURL(url)
          );
        
        await ctx.reply({ embeds: [ embed ], components: [ actionRow ] });
        break;
      }
    }
  }
}