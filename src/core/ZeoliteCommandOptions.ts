import { CommandInteraction, InteractionDataOptions, InteractionDataOptionWithValue, Member, User } from "eris";
import ZeoliteClient from "./ZeoliteClient";

export default class ZeoliteCommandOptions {
  public readonly client: ZeoliteClient;
  private subcommand?: string;
  private hoistedOptions?: InteractionDataOptions[];
  private data?: InteractionDataOptions[];
  private resolved: typeof CommandInteraction.prototype.data.resolved;

  public constructor(client: ZeoliteClient, options?: InteractionDataOptions[], resolved?: typeof CommandInteraction.prototype.data.resolved) {
    this.client = client;
    this.hoistedOptions = options;
    this.resolved = resolved;

    if (options?.[0].type == 1) {
      this.subcommand = options[0].name;
      this.hoistedOptions = options[0].options;
    }

    this.data = options;
  }

  private getOption(name: string): InteractionDataOptionWithValue {
    return this.hoistedOptions?.find(o => o.name == name) as InteractionDataOptionWithValue;
  }

  public getSubcommand(): string | undefined {
    return this.subcommand;
  }

  public getString(name: string): string | undefined {
    return this.getOption(name)?.value as string | undefined;
  }

  public getBoolean(name: string): boolean | undefined {
    return this.getOption(name)?.value as boolean | undefined;
  }

  public getInteger(name: string): number | undefined {
    return this.getOption(name)?.value as number | undefined;
  }

  public async getUser(name: string): Promise<User | void> {
    const id = this.getOption(name)?.value as string;
    const user = this.resolved?.users?.get(id);
    return user;
  }

  public async getMember(name: string): Promise<Omit<Member, "user" | "deaf" | "mute"> | undefined> {
    const id = this.getOption(name)?.value as string;
    const member = this.resolved?.members?.get(id);
    return member;
  }
}