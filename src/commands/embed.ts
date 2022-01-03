import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class EmbedCommand extends ZeoliteCommand {
  name = "embed";
  description = "Creates an embed from JSON";
  options = [
    {
      type: 3,
      name: "json",
      description: "A JSON string that represents the embed",
      required: true,
    },
  ];

  async run(ctx: ZeoliteContext) {
    const embedJson = ctx.interaction.options.getString("json") as string;

    try {
      const embedObj = JSON.parse(embedJson);
      await ctx.reply({ embeds: [ embedObj ] });
    } catch {
      await ctx.reply({ content: ctx.t("embedInvalidJSON"), ephemeral: true });
    }
  }
}