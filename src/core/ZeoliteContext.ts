import ZeoliteClient from "./ZeoliteClient";
import {
  GuildMember,
  CommandInteraction, 
  User, 
  Guild, 
  TextBasedChannel, 
  Message, 
  InteractionReplyOptions,
  InteractionDeferReplyOptions,
  WebhookEditMessageOptions
} from "discord.js";
import { APIMessage } from "discord-api-types";

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

  get channel(): TextBasedChannel | null {
    return this.interaction.channel;
  }

  get commandName(): string {
    return this.interaction.commandName;
  }

  async reply(options: string | InteractionReplyOptions): Promise<Message | void> {
    return this.interaction.reply(options);
  }

  async deferReply(options?: InteractionDeferReplyOptions): Promise<Message | void> {
    return this.interaction.deferReply(options);
  }

  async editReply(options: string | WebhookEditMessageOptions): Promise<Message | APIMessage> {
    return this.interaction.editReply(options);
  }

  async followUp(options: InteractionReplyOptions): Promise<Message | APIMessage | void> {
    return this.interaction.followUp(options);
  }

  t(str: string, ...args: any[]): string {
    return this.client.localization.getString(this.user, str, ...args);
  }
}