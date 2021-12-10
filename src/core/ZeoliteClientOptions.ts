import { ClientOptions } from "discord.js";

export default interface ZeoliteClientOptions extends ClientOptions {
  cmdDirPath: string;
  owners: Array<string>;
  extDirPath: string;
}