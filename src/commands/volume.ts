import { MessageEmbed } from "discord.js";
import { Manager } from "erela.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";


export default class VolumeCommand extends ZeoliteCommand {
  name = "volume";
  description = "Бесполезно";
  options = [
    {
      type: 1,
      name: "get",
      description: "Shows volume percentage",
    },
    {
      type: 1,
      name: "set",
      description: "Sets the music volume",
      options: [
        {
          type: 4,
          name: "volume",
          description: "Volume percentage",
          required: true,
          minValue: 1,
          maxValue: 100,
        },
      ],
    },
  ];

  async run (ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    const manager: Manager = ctx.get("manager");
    const player = manager.players.get(ctx.guild!.id);

    switch (subcommand) {
      case "get": {
        if (!player) {
          await ctx.reply({ content: ctx.t("notPlaying"), ephemeral: true })
          return;
        }

        const embed = new MessageEmbed()
          .setTitle(ctx.t("currentVolume", player.volume))
          .setColor(ctx.get("embColor"))
          .setFooter({ text: ctx.t("volumeFooter") });
        
        await ctx.reply({ embeds: [ embed ] });
        break;
      }

      case "set": {
        if (!player) {
          await ctx.reply({ content: ctx.t("notPlaying"), ephemeral: true })
          return;
        }

        const volumeNumber = ctx.options.getInteger("volume") as number;

        player.setVolume(volumeNumber)

        await ctx.reply(ctx.t("volumeChanged", volumeNumber));
        break;
      }
    }
  }
}