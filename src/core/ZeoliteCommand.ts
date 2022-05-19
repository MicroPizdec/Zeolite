import { ChatInputApplicationCommandStructure, ApplicationCommand, ApplicationCommandOption, ApplicationCommandOptionWithMinMax, ApplicationCommandOptions, Constants } from "eris";
import ZeoliteClient from "./ZeoliteClient";
import ZeoliteContext from "./ZeoliteContext";

type OptionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ZeoliteCommandOption<T extends number = OptionType> {
  type: T;
  name: string;
  description: string;
  required?: boolean;
  options?: ZeoliteCommandOption<T>[];
  min_value: number;
  max_value: number;
}

export default class ZeoliteCommand {
  public name: string;
  public description: string;
  public group?: string;
  public options?: ApplicationCommandOptions[];
  public ownerOnly?: boolean;
  public guildOnly?: boolean;
  public cooldown?: number;
  public requiredPermissions: (keyof Constants["Permissions"])[] = [];

  public readonly client: ZeoliteClient;

  public constructor(client: ZeoliteClient) {
    this.client = client;
  }

  public preLoad(): boolean {
    return true;
  }

  public async run(ctx: ZeoliteContext) {
    throw new Error("abstract class method.");
  }

  public async update(): Promise<ApplicationCommand | undefined> {
    return this.client.createCommand(this.json());
  }

  public json(): ChatInputApplicationCommandStructure {
    return {
      type: 1,
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}