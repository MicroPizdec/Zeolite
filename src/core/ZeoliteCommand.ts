import { 
  Interaction,
  ChatInputApplicationCommandData,
  ApplicationCommandOptionData} from "discord.js";
import ZeoliteClient from "./ZeoliteClient";

export default class ZeoliteCommand {
  name: string = "";
  description: string = "";
  options?: Array<ApplicationCommandOptionData>;
  ownerOnly?: boolean;
  readonly client: ZeoliteClient;

  constructor(client: ZeoliteClient) {
    this.client = client;
  }

  async run(ctx: Interaction) {
    throw new Error("abstract class method.");
  }

  async update(data: ChatInputApplicationCommandData) {
    const cmd = this.client.application?.commands.cache.find(c => c.name == this.name);
    await cmd?.edit(data);

    this.name = data.name;
    this.description = data.description;
  }

  json(): ChatInputApplicationCommandData {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}