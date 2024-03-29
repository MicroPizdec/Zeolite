import { ZeoliteClient, ZeoliteCommand, ZeoliteContext } from 'zeolitecore';

export default class ReloadCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'reload',
      description: 'Не трожь сука это для разрабов!!!',
      group: 'dev',
      options: [
        {
          type: 1,
          name: 'command',
          description: 'Reloads a command. Owner only',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'Command name',
              required: true,
            },
            {
              type: 5,
              name: 'update',
              description: 'Should the command be updated',
              required: false,
            },
          ],
        },
        {
          type: 1,
          name: 'extension',
          description: 'Reloads an extension. Owner only',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'Extension name',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'languages',
          description: 'Reloads languages. Owner only',
        },
      ],
      ownerOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubCommand()!;

    switch (subcommand[0]) {
      case 'command': {
        const name = ctx.options.getString('name')!;
        const update = ctx.options.getBoolean('update');

        if (!this.client.commandsManager.commands.has(name)) {
          await ctx.reply({
            content: ctx.t('reloadCommandDoesntExist'),
            flags: 64,
          });
          return;
        }

        const cmd = this.client.commandsManager.reloadCommand(name);

        if (update) await cmd.update();

        await ctx.reply({ content: ctx.t('reloadSuccess', name), flags: 64 });
        break;
      }
      case 'extension': {
        const name = ctx.options.getString('name')!;

        if (!this.client.extensionsManager.extensions.has(name)) {
          await ctx.reply({
            content: ctx.t('reloadExtensionDoesntExist'),
            flags: 64,
          });
          return;
        }

        this.client.extensionsManager.reloadExtension(name);

        await ctx.reply({
          content: ctx.t('reloadExtensionSuccess', name),
          flags: 64,
        });
        break;
      }
      case 'languages': {
        await this.client.localizationManager.reloadLanguages();

        await ctx.reply({
          content: ctx.t('reloadLanguagesSuccess'),
          flags: 64,
        });
        break;
      }
    }
  }
}
