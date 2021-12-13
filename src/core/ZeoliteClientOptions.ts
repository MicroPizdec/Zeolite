import { ClientOptions } from "discord.js-light";

export default interface ZeoliteClientOptions extends ClientOptions {
  cmdDirPath: string;
  owners: string[];
  extDirPath: string;
}