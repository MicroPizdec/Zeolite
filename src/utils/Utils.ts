export default class Utils {
  static parseTime(num: number): string {
    // yeah i know that this is a shitcode, but at least it works
    const hours = Math.floor(num / 3600);
    let minutes = Math.floor((num - hours * 3600) / 60)
      .toString()
      .padStart(2, '0');
    let seconds = (num - hours * 3600 - parseInt(minutes) * 60).toString().padStart(2, '0');

    return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  }

  static intToHex(num: number): string {
    let hex = num.toString(16);
    return hex.padStart(6, '0');
  }

  static randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
