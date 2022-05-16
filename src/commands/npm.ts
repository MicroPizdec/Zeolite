import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import axios from "axios";
import { MessageEmbed } from "discord.js-light";

export default class NpmCommand extends ZeoliteCommand {
  name = "npm";
  description = "Searches by provided package name in NPM registry";
  group = "other";
  options = [
    {
      type: 3,
      name: "package",
      description: "Package name",
      required: true,
    },
  ];

  async run(ctx: ZeoliteContext) {
    await ctx.deferReply();

    const query = ctx.interaction.options.getString("package", true);

    let response: any;
    try {
      response = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(query)}`)
        .then(r => r.data);
    } catch {
      await ctx.editReply({ content: ctx.t("npmPackageNotFound") });
      return;
    }

    const pkg = response.versions[response["dist-tags"].latest];
    
    const embed = new MessageEmbed()
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setURL(`https://www.npmjs.org/package/${pkg.name}`)
      .setColor(ctx.get("embColor"))
      .addField(ctx.t("npmVersion"), pkg.version)
      .setFooter({ text: ctx.t("npmModifiedAt") })
      .setTimestamp(new Date(response.time.modified));
    
    if (pkg.license) {
      embed.addField(ctx.t("npmLicense"), pkg.license);
    }

    if (pkg.keywords?.length) {
      embed.addField(ctx.t("npmKeywords"), pkg.keywords.map((k: string) => `\`${k}\``).join(", "));
    }

    await ctx.editReply({ embeds: [ embed ] });
  }
}