import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js-light";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class AvatarCommand extends ZeoliteCommand {
  name = "avatar";
  description = "Shows user's avatar";
  options = [
    {
      type: 6,
      name: "user",
      description: "A user",
      required: false,
    },
  ];

  async run(ctx: ZeoliteContext) {
    let user = ctx.interaction.options.getUser("user") || ctx.user;

    let format;
    if (user.avatar) {
      format = user.avatar.startsWith("a_") ? true : false;
    }

    const linkButton = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setLabel(ctx.t("avatarURL"))
        .setStyle('LINK')
        .setURL(`${user.displayAvatarURL({ dynamic: format, size: 2048 })}`)
    );

    const embed = new MessageEmbed()
      .setAuthor({ name: ctx.t("avatarTitle", user.tag) })
      .setColor(0x9f00ff)
      .setImage(user.displayAvatarURL({ dynamic: format, size: 2048 }));
    
    await ctx.reply({ embeds: [ embed ], components: [linkButton] });
  }
}