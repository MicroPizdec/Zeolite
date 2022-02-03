import { 
  ChatInputApplicationCommandData,
  ApplicationCommandOptionData,
  ApplicationCommand
} from "discord.js-light";
import ZeoliteClient from "./ZeoliteClient";
import ZeoliteContext from "./ZeoliteContext";

export default class ZeoliteCommand {
  name: string;
  description: string;
  group?: string;
  options?: ApplicationCommandOptionData[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  cooldown?: number;
  requiredPermissions: string[] = [];

  readonly client: ZeoliteClient;

  constructor(client: ZeoliteClient) {
    this.client = client;
  }

  async run(ctx: ZeoliteContext) {
    throw new Error("abstract class method.");
  }

  async update(): Promise<ApplicationCommand | undefined> {
    return this.client.application?.commands.create(this.json());
  }

  json(): ChatInputApplicationCommandData {
    return {
      type: 1,
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}