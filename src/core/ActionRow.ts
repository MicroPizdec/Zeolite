import { ActionRowComponents } from "eris";

export default class ActionRow {
  public readonly type: 1 = 1;
  public components: ActionRowComponents[];

  public constructor(...buttons: ActionRowComponents[]) {
    this.components = buttons;
  }
}