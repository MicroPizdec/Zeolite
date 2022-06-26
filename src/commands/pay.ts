import ZeoliteCommand from '../core/ZeoliteCommand';
import ZeoliteContext from '../core/ZeoliteContext';
import ZetCoins from '../dbModels/ZetCoins';
import ZetCoinsSettings from '../dbModels/ZetCoinsSettings';
import Embed from '../core/Embed';
import ActionRow from '../core/ActionRow';
import ZeoliteClient from '../core/ZeoliteClient';

export default class PayCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'pay',
      description: 'Sends the provided amount of ZetCoins to specified user',
      group: 'economy',
      options: [
        {
          type: 6,
          name: 'user',
          description: 'A user',
          required: true,
        },
        {
          type: 4,
          name: 'amount',
          description: 'Amount of ZetCoins to send',
          required: true,
        },
      ],
      guildOnly: true,
    });
  }

  async run(ctx: ZeoliteContext) {
    const user = ctx.options.getUser('user')!;
    const amount = ctx.options.getInteger('amount')!;

    if (user.id == ctx.user?.id) {
      await ctx.reply({ content: ctx.t('payCantSendToYourself'), flags: 64 });
      return;
    }

    if (user.bot) {
      await ctx.reply({ content: ctx.t('payCantSendToBot'), flags: 64 });
      return;
    }

    if (amount <= 0) {
      await ctx.reply({ content: ctx.t('payInvalidAmount'), flags: 64 });
      return;
    }

    const settings = await ZetCoinsSettings.findOrCreate({
      where: { guildID: ctx.guild?.id },
    }).then((s) => s[0]);
    const authorBal = await ZetCoins.findOrCreate({
      where: { guildID: ctx.guild?.id, userID: ctx.user?.id },
    }).then((b) => b[0]);
    const userBal = await ZetCoins.findOrCreate({
      where: { guildID: ctx.guild?.id, userID: user.id },
    }).then((b) => b[0]);

    if (authorBal.balance < amount) {
      await ctx.reply({
        content: ctx.t('payInsufficientFunds', authorBal.balance, settings?.icon),
        flags: 64,
      });
    }

    const confirmEmbed = new Embed()
      .setTitle(ctx.t('payConfirmationTitle', amount, settings?.icon, `${user.username}#${user.discriminator}`))
      .setDescription(ctx.t('payConfirmationDesc'))
      .setColor(ctx.get('embColor'));

    const actionRow = new ActionRow(
      {
        type: 2,
        label: ctx.t('payYes'),
        style: 3,
        custom_id: 'yes',
        emoji: {
          name: 'success',
          id: '933053645078007839',
        },
      },
      {
        type: 2,
        label: ctx.t('payNo'),
        style: 4,
        custom_id: 'no',
        emoji: {
          name: 'fail',
          id: '933053644948004954',
        },
      },
    );

    await ctx.reply({ embeds: [confirmEmbed], components: [actionRow] });
    const message = await ctx.interaction.getOriginalMessage();

    const component = await ctx.collectButton({
      filter: (i) => (i.member || i.user!).id == ctx.user?.id,
      messageID: message.id,
      timeout: 60000,
    });

    if (!component) {
      const timeExpiredEmbed = new Embed().setTitle(ctx.t('payTimeExpired')).setColor(ctx.get('embColor'));

      await ctx.editReply({ embeds: [timeExpiredEmbed] });
    }

    const button = component?.data;

    if (button?.custom_id == 'yes') {
      await userBal.update({ balance: userBal.balance + amount });
      await authorBal.update({ balance: authorBal.balance - amount });
      const successEmbed = new Embed()
        .setTitle(ctx.t('paySuccessfullySent', amount, settings?.icon, `${user.username}#${user.discriminator}`))
        .setAuthor({
          name: `${ctx.user?.username}#${ctx.user?.discriminator}`,
          icon_url: ctx.user?.avatarURL,
        })
        .setColor(0x57f287);

      await component?.editParent({ embeds: [successEmbed], components: [] });
    } else {
      const failEmbed = new Embed()
        .setTitle(ctx.t('payCancelled'))
        .setAuthor({
          name: `${ctx.user?.username}#${ctx.user?.discriminator}`,
          icon_url: ctx.user?.avatarURL,
        })
        .setColor(0xed4245);

      await component?.editParent({ embeds: [failEmbed], components: [] });
    }
  }
}
