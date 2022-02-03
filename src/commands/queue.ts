import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageActionRowComponent,
  User,
  InteractionCollector,
  ButtonInteraction
} from "discord.js";
import { Manager } from "erela.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Utils from "../utils/Utils";

export default class QueueCommand extends ZeoliteCommand {
  name = "queue";
  description = "Shows the track queue";
  group = "music";
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const manager: Manager = ctx.get("manager");
    const player = manager.players.get(ctx.guild!.id);
    if (!player) {
      await ctx.reply({ content: ctx.t("notPlaying"), ephemeral: true });
      return;
    }

    if (!player.queue.size) {
      await ctx.reply({ content: ctx.t("queueEmpty"), ephemeral: true });
      return;
    }
    
    const embed = new MessageEmbed()
      .setTitle(ctx.t("queue"))
      .setColor(ctx.get("embColor"))

    const fields: { name: string, value: string }[] = [];
    let index = 0;
    for (const track of player.queue) {
      fields.push({
        name: `${++index}: ${track.title}`,
        value: ctx.t("durationRequestedBy", Utils.parseTime(Math.floor(track.duration! / 1000)), (track.requester as User).tag),
      });
    }

    if (player.queue.size > 10) {
      const pages: { name: string, value: string }[][] = [];

      while (fields.length) {
        const arr: { name: string, value: string }[] = [];
        for (const field of fields.splice(0, 10)) {
          arr.push(field);
        }
        pages.push(arr);
      }

      let pageNum = 0;
      embed.addFields(pages[pageNum]);
      embed.setFooter({ text: ctx.t("queueFooter", pageNum + 1, pages.length) });

      const actionRow = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel(ctx.t("back"))
            .setCustomId("back")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setLabel(ctx.t("forward"))
            .setCustomId("forward")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setLabel(ctx.t("close"))
            .setCustomId("close")
            .setStyle("DANGER")
        );
      
      const msg = await ctx.reply({ embeds: [ embed ], components: [ actionRow ], fetchReply: true });
      
      const collector = new InteractionCollector(this.client, {
        componentType: "BUTTON",
        filter: i => i.user.id == ctx.user.id,
        time: 600000,
      });

      collector.on("collect", (interaction: ButtonInteraction) => {
        switch ((interaction.component as MessageButton).customId) {
          case "back": {
            if (pageNum == 0) return;
            pageNum--;
            break;
          }
          case "forward": {
            if (pageNum == (pages.length - 1)) return;
            pageNum++;
            break;
          }
          case "close": {
            collector.stop();
            ctx.interaction.deleteReply();
            break;
          }
        }

        embed.spliceFields(0, 10, pages[pageNum]);
        embed.setFooter({ text: ctx.t("queueFooter", pageNum + 1, pages.length) });
        interaction.update({ embeds: [ embed ] });
      });
    } else {
      embed.addFields(fields);
      await ctx.reply({ embeds: [ embed ] });
    }
  }
}