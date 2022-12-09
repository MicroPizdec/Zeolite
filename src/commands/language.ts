import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import Languages from '../dbModels/Languages';

export default class LanguageCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'language',
      description: 'Changes your language or shows a list of them',
      group: 'settings',
      options: [
        {
          type: 1,
          name: 'get',
          description: 'Shows list of available languages and your current language',
        },
        {
          type: 1,
          name: 'set',
          description: 'Changes your language',
          options: [
            {
              type: 3,
              name: 'lang',
              description: 'Language',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'reset',
          description: 'Resets your language to default',
        },
      ],
    });
  }

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubCommand()!;

    const dbLang = await Languages.findOne({ where: { userID: ctx.user?.id } });

    switch (subcommand[0]) {
      case "get": {
        const availableLangs = Object.keys(this.client.localizationManager.languageStrings);

        const embed = new Embed()
          .setTitle(ctx.t('langAvailableLanguages'))
          .setDescription(availableLangs.map((l) => `\`${l}\``).join(', '))
          .setAuthor({
            name: `${ctx.user?.username}#${ctx.user?.discriminator}`,
            iconURL: ctx.user?.avatarURL(),
          })
          .addField(ctx.t('langYourLanguage'), `\`${dbLang?.language || ctx.t('langDefault')}\``)
          .setColor(ctx.get('embColor'));

        await ctx.reply({ embeds: [embed], flags: 64 });
        break;
      }

      case "set": {
        const language = ctx.options.getString('lang')!;

        if (!Object.keys(this.client.localizationManager.languageStrings).includes(language)) {
          return ctx.reply({ content: ctx.t('langInvalid'), flags: 64 });
        }

        await dbLang?.update({ language, langChanged: true });
        this.client.localizationManager.userLanguages[ctx.user!.id] = language;
        await ctx.reply({ content: ctx.t('langSuccess', language), flags: 64 });
        break;
      }

      case "reset": {
        await dbLang?.update({ language: null, langChanged: false });
        this.client.localizationManager.userLanguages[ctx.user.id] = ctx.locale;
        await ctx.reply({ content: ctx.t('langSuccess', ctx.t('langDefault')), flags: 64 });
        break;
      }
    }
  }
}
