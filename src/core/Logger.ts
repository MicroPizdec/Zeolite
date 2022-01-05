export default class Logger {
  private level: LoggerLevel;
  name: string;

  constructor(level: LoggerLevel, name: string) {
    this.level = level;
    this.name = name;
  }

  setLogLevel(level: LoggerLevel) {
    this.level = level;
  }

  debug(msg: string) {
    if (this.level > LoggerLevel.Debug) return;
    console.log(`\x1b[34m[DEBUG: ${this.name}]\x1b[0m ${msg}`);
  }

  info(msg: string) {
    if (this.level > LoggerLevel.Info) return;
    console.log(`\x1b[32m[INFO: ${this.name}]\x1b[0m ${msg}`);
  }

  warn(msg: string) {
    if (this.level > LoggerLevel.Warn) return;
    console.log(`\x1b[33m[WARNING: ${this.name}]\x1b[0m ${msg}`);
  }

  error(msg: string) {
    if (this.level > LoggerLevel.Error) return;
    console.log(`\x1b[31m[ERROR: ${this.name}]\x1b[0m ${msg}`);
  }
}

export enum LoggerLevel {
  Debug,
  Info,
  Warn,
  Error,
}