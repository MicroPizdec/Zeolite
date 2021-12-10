import ZeoliteClient from "./ZeoliteClient";

export default class ZeoliteExtension {
  readonly client: ZeoliteClient;
  name: string = "";

  constructor(client: ZeoliteClient) {
    this.client = client;
  }

  onLoad() {
    throw new Error("abstract class method.");
  }

  onUnload() {
    throw new Error("abstract class method.");
  }
}