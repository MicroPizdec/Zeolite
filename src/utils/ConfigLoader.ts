import fs from 'fs';
import { load } from 'js-yaml';
import { getLogger } from 'log4js';

export default class ConfigLoader {
  public static loadConfig(cfgPath: string): Config {
    try {
      return load(fs.readFileSync(cfgPath, { encoding: 'utf-8' })) as Config;
    } catch (err) {
      console.error('Config file not found or invalid. Exiting.');
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
