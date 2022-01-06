import Logger, { LoggerLevel } from "../core/Logger";
import fs from "fs";
import { load } from "js-yaml";

export default class ConfigLoader {
  private logger = new Logger(LoggerLevel.Info, "ConfigLoader");

  loadConfig(cfgPath: string) {
    try {
      return load(fs.readFileSync(cfgPath, { encoding: "utf-8" })) as Config;
    } catch {
      this.logger.error("Config file invalid or does not exist. Exiting...");
      process.exit(1);
    }
  }
}

export interface Config {
  token: string;
  owners: string[];
  dbUri: string;
  webhookUrl?: string;
  debug?: boolean;
}