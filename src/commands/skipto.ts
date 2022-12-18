import { ApplicationCommandOptionTypes } from "oceanic.js";
import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from "zeolitecore";

export default class SkiptoCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'skipto',
      description: 'Skip to specified track',
      group: 'music',
      options: [
        {
          type: ApplicationCommandOptionTypes.NUMBER,
          name: 'tracknumber',
          description: 'Number of track in the queue',
          required: true,
        },
      ],
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    await ctx.reply({ content: 'soon <:trollLutiy:956913207375724644>' });
  }
}