import { 
  Interaction,
  ChatInputApplicationCommandData,
  ApplicationCommandOptionData
} from "discord.js-light";
import ZeoliteClient from "./ZeoliteClient";
import ZeoliteContext from "./ZeoliteContext";

export default class ZeoliteCommand {
  name: string = "";
  description: string = "";
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

  async update(data: ChatInputApplicationCommandData) {
    const cmd = this.client.application?.commands.cache.find(c => c.name == this.name);
    await cmd?.edit(data);

    this.name = data.name;
    this.description = data.description;
    this.options = data.options;
  }

  json(): ChatInputApplicationCommandData {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}