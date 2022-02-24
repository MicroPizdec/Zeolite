import Logger, { LoggerLevel } from "../core/Logger";
import ZeoliteExtension from "../core/ZeoliteExtension";
import ZetCoins from "../dbModels/ZetCoins";

export default class DepositHandlerExtension extends ZeoliteExtension {
  name = "depositHandler";
  private timer: NodeJS.Timer;
  private logger: Logger = new Logger(LoggerLevel.Info, "DepositHandler");

  private async handleDeposits() {
    const bals = await ZetCoins.findAll();

    for (const bal of bals) {
      if (bal.depositBal > 250000) continue;
      await bal.update({ depositBal: Math.floor(bal.depositBal + bal.depositBal * 0.01) });
    }

    this.logger.info("Deposits updated.");
  }

  public onLoad() {
    this.timer = setInterval(this.handleDeposits, 4 * 3600 * 1000);
  }

  public onUnload() {
    clearInterval(this.timer);
  }
}