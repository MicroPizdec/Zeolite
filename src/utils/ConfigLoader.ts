import { ZeoliteLogger, LoggerLevel } from 'zeolitecore';
import fs from 'fs';
import { load } from 'js-yaml';

export default class ConfigLoader {
  private logger = new ZeoliteLogger(LoggerLevel.Info, 'ConfigLoader');

  public loadConfig(cfgPath: string): Config {
    try {
      this.logger.info('Loading config...');
      return load(fs.readFileSync(cfgPath, { encoding: 'utf-8' })) as Config;
    } catch (err) {
      this.logger.error('Config file invalid or does not exist. Exiting...');
      console.log(err);
      process.exit(1);
    }
  }
}

export interface Config {
  token: string;
  owners: string[];
  dbUri: string;
  webhookID?: string;
  webhookToken?: string;
  defaultColor?: number;
  debug?: boolean;
  lavalinkNodes?: LavalinkNode[];
  githubApiKey?: string;
  links: ConfigLinks;
}

export interface ConfigLinks {
  support?: string;
  repo?: string;
  donate?: string;
}

export interface LavalinkNode {
  host: string;
  port: number;
  password: string;
}
