import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import axios from "axios";
import { MessageEmbed } from "discord.js";

export default class UrbanCommand extends ZeoliteCommand {
  name = "urban";
  description = "Searches the definition by provided word in Urban Dictionary";
  options = [
    {
      type: 3,
      name: "word",
      description: "A word",
      required: true,
    },
  ];

  async run(ctx: ZeoliteContext) {
    await ctx.deferReply();

    const word = ctx.interaction.options.getString("word") as string;

    const params = new URLSearchParams();
    params.append("term", word);

    let response: any;
    try {
      response = await axios.get(`http://api.urbandictionary.com/v0/define?${params}`)
        .then(r => r.data);
    } catch {
      await ctx.editReply({ content: ctx.t("urbanSomethingWentWrong") });
      return;
    }

    const data = response.list[0];

    if (!data) {
      await ctx.editReply(ctx.t("urbanWordNotFound"))
      return;
    }

    if ((!data.definition?.length || data.definition.length > 3920) || data.example.length > 1000) {
      const defErrorEmbed = new MessageEmbed()
        .setDescription(ctx.t("urbanCantShowDefinition", data.permalink))
        .setColor("RED")
      await ctx.editReply({ embeds: [ defErrorEmbed ] })
      return;
    }    
    const embed = new MessageEmbed()
      .setTitle(data.word)
      .setDescription(data.definition)
      .setColor(0x9f00ff)
      .setURL(data.permalink)
      .addField(ctx.t("urbanRating"), `${data.thumbs_up} :thumbsup:\n${data.thumbs_down} :thumbsdown:`)
      .setFooter({ text: ctx.t("urbanAuthor", data.author) })

    if (data.example) {
      embed.addField(ctx.t("urbanExample"), data.example);
    }

    await ctx.editReply({ embeds: [ embed ] });
  }
}