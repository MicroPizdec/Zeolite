import ZeoliteClient from "../core/ZeoliteClient";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Embed from "../core/Embed";
import ActionRow from "../core/ActionRow";
import Button from "../core/Button";

export default class AvatarCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: "avatar",
      description: "Shows user's avatar",
      group: "general",
      options: [
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
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    switch (subcommand) {
      case "user": {
        const user = await ctx.options.getUser("user") || ctx.user;
        const member = await ctx.guild?.members.get(user!.id);
        const forceUserAvatar = ctx.options.getBoolean("forceuseravatar") || false;

        const dynamic = member?.avatar?.startsWith("a_") || user?.avatar?.startsWith("a_");
        const url = forceUserAvatar ? user?.dynamicAvatarURL(dynamic ? "gif" : "png", 2048)
          : member?.avatarURL;

        /*const linkButton = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setLabel(ctx.t("avatarURL"))
              .setStyle('LINK')
              .setURL(url)
          ); */

        const actionRow = new ActionRow({
          type: 2,
          label: ctx.t("avatarURL"),
          style: 5,
          url: url!,
        });
          
        const embed = new Embed()
          .setAuthor({ name: ctx.t("avatarTitle", `${user?.username}#${user?.discriminator}`) })
          .setColor(ctx.get("embColor"))
          .setImage(url!);
    
        await ctx.reply({ embeds: [ embed ], components: [ actionRow ] });
        break;
      }

      case "server": {
        const dynamic = ctx.guild?.icon?.startsWith("a_");
        const url = ctx.guild?.iconURL;

        if (!url) {
          await ctx.reply({ content: ctx.t("avatarNoServerIcon"), flags: 64 });
          return;
        }

        const embed = new Embed()
          .setAuthor({ name: ctx.t("avatarServerIcon") })
          .setColor(ctx.get("embColor"))
          .setImage(url);
        
        const actionRow = new ActionRow({
          type: 2,
          label: ctx.t("avatarIconURL"),
          style: 5,
          url,
        });
        
        await ctx.reply({ embeds: [ embed ], components: [ actionRow ] });
        break;
      }

      case "banner": {
        const url = ctx.guild?.bannerURL;

        if (!url) {
          await ctx.reply({ content: ctx.t("avatarNoBanner"), flags: 64 });
          return;
        }

        const embed = new Embed()
          .setAuthor({ name: ctx.t("avatarBanner") })
          .setColor(ctx.get("embColor"))
          .setImage(url);
        
        const actionRow = new ActionRow({
          type: 2,
          label: ctx.t("avatarBannerURL"),
          style: 5,
          url,
        });
        
        await ctx.reply({ embeds: [ embed ], components: [ actionRow ] });
        break;
      }
    }
  }
}