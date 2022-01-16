export default function intToHex(num: number): string {
  let hex = num.toString(16);

  while (hex.length < 6) {
    hex = "0" + hex;
  }

  return hex;
}