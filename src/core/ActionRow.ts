import Button from "./Button";

export default class ActionRow {
  public readonly type: number = 1;
  public components: Button[];

  public constructor(...buttons: Button[]) {
    this.components = buttons;
  }
}