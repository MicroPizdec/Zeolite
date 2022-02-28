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
  WebhookEditMessageOptions,
  CommandInteractionOptionResolver,
  Collection
} from "discord.js";
import { APIMessage } from "discord-api-types";

export default class ZeoliteContext {
  public readonly client: ZeoliteClient;
  public readonly interaction: CommandInteraction;
  
  private data: Collection<string, any> = new Collection<string, any>();

  public constructor(client: ZeoliteClient, interaction: CommandInteraction) {
    this.client = client;
    this.interaction = interaction;
  }

  public get user(): User {
    return this.interaction.user;
  }

  public get member(): GuildMember {
    return this.interaction.member as GuildMember;
  }

  public get guild(): Guild | null {
    return this.interaction.guild;
  }

  public get channel(): TextBasedChannel | null {
    return this.interaction.channel;
  }

  public get commandName(): string {
    return this.interaction.commandName;
  }

  public get options(): Omit<CommandInteractionOptionResolver, "getMessage" | "getFocused"> {
    return this.interaction.options;
  }

  public async reply(options: string | InteractionReplyOptions): Promise<Message | void> {
    return this.interaction.reply(options);
  }

  public async deferReply(options?: InteractionDeferReplyOptions): Promise<Message | void> {
    return this.interaction.deferReply(options);
  }

  public async editReply(options: string | WebhookEditMessageOptions): Promise<Message | APIMessage> {
    return this.interaction.editReply(options);
  }

  public async followUp(options: InteractionReplyOptions): Promise<Message | APIMessage | void> {
    return this.interaction.followUp(options);
  }

  public t(str: string, ...args: any[]): string {
    return this.client.localization.getString(this.user, str, ...args);
  }

  public set(key: string, data: any) {
    this.data.set(key, data);
  }

  public get<T>(key: string): T {
    return this.data.get(key) as T;
  }
}