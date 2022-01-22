import Logger, { LoggerLevel } from "../core/Logger";
import ZeoliteExtension from "../core/ZeoliteExtension";
import ZetCoins from "../dbModels/ZetCoins";

export default class DepositHandlerExtension extends ZeoliteExtension {
  name = "depositHandler";
  timer: NodeJS.Timer;
  logger: Logger = new Logger(LoggerLevel.Info, "DepositHandlerExtension");

  async handleDeposits() {
    const bals = await ZetCoins.findAll();

    for (const bal of bals) {
      if (bal.depositBal > 250000) continue;
      await bal.update({ depositBal: Math.floor(bal.depositBal + bal.depositBal * 0.01) });
    }

    this.logger.info("Deposits updated.");
  }

  onLoad() {
    this.timer = setInterval(this.handleDeposits, 4 * 3600 * 1000);
  }

  onUnload() {
    clearInterval(this.timer);
  }
}