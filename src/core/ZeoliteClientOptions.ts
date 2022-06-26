import { ClientOptions } from 'eris';

export default interface ZeoliteClientOptions extends ClientOptions {
  cmdDirPath: string;
  owners: string[];
  extDirPath: string;
  debug?: boolean;
}
