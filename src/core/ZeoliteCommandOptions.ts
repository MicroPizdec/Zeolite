import { InteractionDataOptions, InteractionDataOptionWithValue } from "eris";
import ZeoliteClient from "./ZeoliteClient";

export default class ZeoliteCommandOptions {
  public readonly client: ZeoliteClient;
  private subcommand?: string;
  private hoistedOptions?: InteractionDataOptions[];
  private data?: InteractionDataOptions[];

  public constructor(client: ZeoliteClient, options?: InteractionDataOptions[]) {
    this.client = client;
    this.hoistedOptions = options;

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
}