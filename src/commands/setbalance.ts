import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import ZetCoins from "../dbModels/ZetCoins";
import ZetCoinsSettings from "../dbModels/ZetCoinsSettings";

export default class SetBalanceCommand extends ZeoliteCommand {
  name = "setbalance";
  description = "Sets the provided user's balance. Administrator only.";
  group = "economy";
  options = [
    {
      type: 6,
      name: "user",
      description: "A user",
      required: true,
    },
    {
      type: 4,
      name: "amount",
      description: "Amount of money",
      required: true,
    },
  ];
  requiredPermissions = [ "ADMINISTRATOR" ];

  async run(ctx: ZeoliteContext) {
    const user = ctx.options.getUser("user", true);
    const amount = ctx.options.getInteger("amount", true);

    if (user.bot) {
      await ctx.reply({ content: ctx.t("setbalanceBot"), ephemeral: true });
      return;
    }

    const settings = await ZetCoinsSettings.findOrCreate({ where: { guildID: ctx.guild?.id } })
      .then(s => s[0]);
    const userBalance = await ZetCoins.findOrCreate({ where: { guildID: ctx.guild?.id, userID: user.id } })
      .then(b => b[0]);

    await userBalance.update({ balance: amount });

    await ctx.reply(ctx.t("setbalanceSuccess", user.tag, amount, settings.icon));
  }
}