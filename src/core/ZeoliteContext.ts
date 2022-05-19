import ZeoliteClient from "./ZeoliteClient";
import { CommandInteraction, User, Member, Guild, TextableChannel, InteractionDataOptions, InteractionOptions, InteractionContent, InteractionEditContent, Message } from "eris";
import { APIMessage } from "discord-api-types";
import ZeoliteCommand from "./ZeoliteCommand";

export default class ZeoliteContext {
  private data: Map<string, any> = new Map<string, any>();

  public constructor(
    public readonly client: ZeoliteClient,
    public readonly interaction: CommandInteraction,
    public readonly command: ZeoliteCommand
  ) {}

  public get user(): User | undefined {
    return this.interaction.user;
  }

  public get member(): Member | undefined {
    return this.interaction.member;
  }

  public get guild(): Guild | undefined {
    return this.client.guilds.get(this.interaction.guildID!);
  }

  public get channel(): TextableChannel {
    return this.interaction.channel;
  }

  public get commandName(): string {
    return this.interaction.data.name;
  }

  public get options(): InteractionDataOptions[] | undefined {
    return this.interaction.data.options;
  }

  public async reply(options: string | InteractionContent) {
    return this.interaction.createMessage(options);
  }

  public async defer(flags?: number) {
    return this.interaction.defer(flags);
  }

  public async editReply(options: string | InteractionEditContent) {
    return this.interaction.editOriginalMessage(options)
  }

  public async followUp(options: string | InteractionContent): Promise<Message> {
    return this.interaction.createFollowup(options)
  }

  public t(str: string, ...args: any[]): string {
    return this.client.localization.getString(this.member || this.user!, str, ...args);
  }

  public set(key: string, data: any) {
    this.data.set(key, data);
  }

  public get<T>(key: string): T {
    return this.data.get(key) as T;
  }
}