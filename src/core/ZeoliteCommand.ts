import { 
  ChatInputApplicationCommandData,
  ApplicationCommandOptionData,
  ApplicationCommand
} from "discord.js-light";
import ZeoliteClient from "./ZeoliteClient";
import ZeoliteContext from "./ZeoliteContext";

export default class ZeoliteCommand {
  public name: string;
  public description: string;
  public group?: string;
  public options?: ApplicationCommandOptionData[];
  public ownerOnly?: boolean;
  public guildOnly?: boolean;
  public cooldown?: number;
  public requiredPermissions: string[] = [];

  public readonly client: ZeoliteClient;

  public constructor(client: ZeoliteClient) {
    this.client = client;
  }

  public async run(ctx: ZeoliteContext) {
    throw new Error("abstract class method.");
  }

  public async update(): Promise<ApplicationCommand | undefined> {
    return this.client.application?.commands.create(this.json());
  }

  public json(): ChatInputApplicationCommandData {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}