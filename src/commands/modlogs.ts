import { MessageEmbed } from "discord.js-light";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Modlogs from "../dbModels/Modlogs";
import ModlogsExtension from "../extensions/modlogs";

export default class ModlogsCommand extends ZeoliteCommand {
  name = "modlogs";
  description = "Modlogs command";
  group = "settings";
  options = [
    {
      type: 1,
      name: "get",
      description: "Shows current modlogs channel. Requires Manage Server permission.",
    },
    {
      type: 1,
      name: "set",
      description: "Sets modlogs channel. Requires Manage Server permission.",
      options: [
        {
          type: 7,
          name: "channel",
          description: "A channel",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "disable",
      description: "Disables modlogs. Requires Manage Server permission.",
    },
  ];
  guildOnly = true;
  requiredPermissions = [ "MANAGE_GUILD" ];

  async run(ctx: ZeoliteContext) {
    const modlogs = await Modlogs.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(m => m[0]);

    switch (ctx.options.getSubcommand()) {
      case "get": {
        const embed = new MessageEmbed()
          .setDescription(modlogs.channelID ? ctx.t("modlogsEnabled", modlogs.channelID) : ctx.t("modlogsDisabled"))
          .setColor(ctx.get("embColor"))
          .setFooter({ text: ctx.t("modlogsFooter") });

        await ctx.reply({ embeds: [ embed ], ephemeral: true });
        break;
      }
      
      case "set": {
        const channel = ctx.options.getChannel("channel", true);

        if (channel.type != "GUILD_TEXT") {
          await ctx.reply({ content: ctx.t("modlogsNonTextChannel"), ephemeral: true });
          return;
        }

        const botPerms = channel.permissionsFor(ctx.guild?.me!);
        if (!botPerms.has("SEND_MESSAGES") || !botPerms.has("EMBED_LINKS")) {
          await ctx.reply({ content: ctx.t("modlogsNoPermsForBot"), ephemeral: true });
          return;
        }

        await modlogs.update({ channelID: channel.id });
        (this.client.extensions.get("modlogs") as ModlogsExtension).channelsCache[ctx.guild?.id!] = channel.id;
        await ctx.reply({ content: ctx.t("modlogsSuccess", channel.name) });
        break;
      }

      case "disable": {
        await modlogs.destroy();
        delete (this.client.extensions.get("modlogs") as ModlogsExtension).channelsCache[ctx.guild?.id!];

        await ctx.reply({ content: ctx.t("modlogsDisableSuccess") });
        break;
      }
    }
  }
}