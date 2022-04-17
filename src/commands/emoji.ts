import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class EmojiCommand extends ZeoliteCommand {
  name = "emoji";
  description = "Shows info about emoji";
  group = "other";
  options = [
    {
      type: 3,
      name: "emoji",
      description: "Server emoji. Built-in Discord emojis are not supported",
      required: true,
    },
  ];
  guildOnly = true;

  async run(ctx: ZeoliteContext) {
    const emojiName = ctx.options.getString("emoji", true);

    if (!/<a:.+?:\d+>|<:.+?:\d+>/g.test(emojiName)) {
      await ctx.reply({ content: ctx.t("emojiNotFound"), ephemeral: true });
      return;
    }

    const id = emojiName.match(/(?<=:)\d+/g)![0];
    const emoji = ctx.guild!.emojis.cache.get(id);

    const embed = new MessageEmbed()
      .setTitle(emoji?.name!)
      .setThumbnail(emoji?.url!)
      .setColor(ctx.get("embColor"))
      .addField("ID", id)
      .addField(ctx.t("emojiAnimated"), emoji?.animated ? ctx.t("payYes") : ctx.t("payNo"));

    const actionRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel(ctx.t("emojiLink"))
          .setStyle("LINK")
          .setURL(emoji?.url!)
      );

    await ctx.reply({ embeds: [ embed ], components: [ actionRow ] });
  }
}