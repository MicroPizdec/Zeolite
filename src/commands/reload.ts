import ZeoliteClient from "../core/ZeoliteClient";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";

export default class ReloadCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: "reload",
      description: "Не трожь сука это для разрабов!!!",
      group: "dev",
      options: [
        {
          type: 1,
          name: "command",
          description: "Reloads a command. Owner only",
          options: [
            {
              type: 3,
              name: "name",
              description: "Command name",
              required: true,
            },
            {
              type: 5,
              name: "update",
              description: "Should the command be updated",
              required: false,
            },
          ],
        },
        {
          type: 1,
          name: "extension",
          description: "Reloads an extension. Owner only",
          options: [
            {
              type: 3,
              name: "name",
              description: "Extension name",
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "languages",
          description: "Reloads languages. Owner only",
        }
      ],
      ownerOnly: true,
    });
  }
  
  public async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    switch (subcommand) {
      case "command": {
        const name = ctx.options.getString("name")!;
        const update = ctx.options.getBoolean("update");

        if (!this.client.commands.has(name)) {
          await ctx.reply({ content: ctx.t("reloadCommandDoesntExist"), flags: 64 });
          return;
        }

        const cmd = this.client.reloadCommand(name);

        if (update) await cmd.update();
        
        await ctx.reply({ content: ctx.t("reloadSuccess", name), flags: 64 });
        break;
      }
      case "extension": {
        const name = ctx.options.getString("name")!;

        if (!this.client.extensions.has(name)) {
          await ctx.reply({ content: ctx.t("reloadExtensionDoesntExist"), flags: 64 });
          return;
        }

        this.client.reloadExtension(name);

        await ctx.reply({ content: ctx.t("reloadExtensionSuccess", name), flags: 64 });
        break;
      }
      case "languages": {
        this.client.localization.reloadLanguages();

        await ctx.reply({ content: ctx.t("reloadLanguagesSuccess"), flags: 64 });
        break;
      } 
    }
  }
}