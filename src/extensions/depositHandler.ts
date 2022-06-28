import { ZeoliteExtension, ZeoliteLogger, LoggerLevel } from 'zeolitecore';
import ZetCoins from '../dbModels/ZetCoins';

let self: DepositHandlerExtension;

export default class DepositHandlerExtension extends ZeoliteExtension {
  name = 'depositHandler';
  private timer: NodeJS.Timer;
  public logger: ZeoliteLogger = new ZeoliteLogger(LoggerLevel.Info, 'DepositHandler');

  private async handleDeposits() {
    const bals = await ZetCoins.findAll();

    for (const bal of bals) {
      if (bal.depositBal > 250000) continue;
      await bal.update({
        depositBal: Math.floor(bal.depositBal + bal.depositBal * 0.01),
      });
    }

    self.logger.info('Deposits updated.');
  }

  public onLoad() {
    self = this;
    this.timer = setInterval(this.handleDeposits, 4 * 3600 * 1000);
  }

  public onUnload() {
    clearInterval(this.timer);
  }
}
