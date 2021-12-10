export default class Logger {
  private level: LoggerLevel;

  constructor(level: LoggerLevel) {
    this.level = level;
  }

  setLogLevel(level: LoggerLevel) {
    this.level = level;
  }

  debug(msg: string) {
    if (this.level > LoggerLevel.Debug) return;
    console.log(`\x1b[34m[DEBUG]\x1b[0m ${msg}`);
  }

  info(msg: string) {
    if (this.level > LoggerLevel.Info) return;
    console.log(`\x1b[32m[INFO]\x1b[0m ${msg}`);
  }

  warn(msg: string) {
    if (this.level > LoggerLevel.Warn) return;
    console.log(`\x1b[33m[WARNING]\x1b[0m ${msg}`);
  }

  error(msg: string) {
    if (this.level > LoggerLevel.Error) return;
    console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
  }
}

export enum LoggerLevel {
  Debug,
  Info,
  Warn,
  Error,
}