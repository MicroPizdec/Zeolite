export default class Utils {
  static parseTime(num: number): string {
    const hours = Math.floor(num / 3600);
    let minutes: string | number = Math.floor((num - (hours * 3600)) / 60) ;
    let seconds: string | number  = num - (hours * 3600) - (minutes * 60);
  
    if (hours && minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
  
    return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  }

  static intToHex(num: number): string {
    let hex = num.toString(16);
    return hex.padStart(6, "0");
  }

  static randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}