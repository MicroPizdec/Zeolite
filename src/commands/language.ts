import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import Languages from '../dbModels/Languages';
import Utils from '../utils/Utils';

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
              choices: [
                {
                  name: 'English (US)',
                  value: 'en-US',
                },
                {
                  name: 'Russian',
                  value: 'ru',
                },
              ],
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
      case 'get': {
        const availableLangs = Object.keys(this.client.localizationManager.languageStrings);

        const embed = new Embed()
          .setTitle(ctx.t('langAvailableLanguages'))
          .setDescription(availableLangs.map((l) => `\`${l}\``).join(', '))
          .setAuthor({
            name: Utils.getUserTag(ctx.user),
            iconURL: ctx.user?.avatarURL(),
          })
          .addField(ctx.t('langYourLanguage'), `\`${dbLang?.language || ctx.t('langDefault')}\``)
          .setColor(ctx.get('embColor'));

        await ctx.reply({ embeds: [embed], flags: 64 });
        break;
      }

      case 'set': {
        const language = ctx.options.getString('lang')!;

        if (!Object.keys(this.client.localizationManager.languageStrings).includes(language)) {
          return ctx.reply({ content: ctx.t('langInvalid'), flags: 64 });
        }

        await this.client.localizationManager.langProvider?.updateUserLanguage(ctx.user.id, language);
        this.client.localizationManager.userLanguages[ctx.user!.id] = language;
        await ctx.reply({ content: ctx.t('langSuccess', language), flags: 64 });
        break;
      }

      case 'reset': {
        await this.client.localizationManager.langProvider?.deleteUserLanguage(ctx.user.id);
        this.client.localizationManager.userLanguages[ctx.user.id] = ctx.locale;
        await ctx.reply({ content: ctx.t('langSuccess', ctx.t('langDefault')), flags: 64 });
        break;
      }
    }
  }
}
