import ZeoliteClient from "./ZeoliteClient";
import { GuildMember, CommandInteraction, User, Guild, TextBasedChannels, Message, InteractionReplyOptions } from "discord.js";

export default class ZeoliteContext {
  readonly client: ZeoliteClient;
  readonly interaction: CommandInteraction;

  constructor(client: ZeoliteClient, interaction: CommandInteraction) {
    this.client = client;
    this.interaction = interaction;
  }

  get user(): User {
    return this.interaction.user;
  }

  get member(): GuildMember {
    return this.interaction.member as GuildMember;
  }

  get guild(): Guild | null {
    return this.interaction.guild;
  }

  get channel(): TextBasedChannels | null {
    return this.interaction.channel;
  }

  get commandName(): string {
    return this.interaction.commandName;
  }

  async reply(options: InteractionReplyOptions): Promise<Message | void> {
    return this.interaction.reply(options);
  }

  t(str: string, ...args: any[]): string {
    return this.client.localization.getString(this.user, str, ...args);
  }
}