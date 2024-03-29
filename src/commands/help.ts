import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';

export default class HelpCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'help',
      description: "Help! I'm stuck!",
      group: 'general',
    });
  }

  async run(ctx: ZeoliteContext) {
    const embed = new Embed()
      .setTitle(ctx.t('commands'))
      .setDescription(ctx.t('helpDesc'))
      .addField(ctx.t('generalGroup'), this.mapCommandsByGroup('general'))
      .addField(ctx.t('economyGroup'), this.mapCommandsByGroup('economy'))
      .addField(ctx.t('musicGroup'), this.mapCommandsByGroup('music'))
      .addField(ctx.t('funGroup'), this.mapCommandsByGroup('fun'))
      .addField(ctx.t('otherGroup'), this.mapCommandsByGroup('other'))
      .addField(ctx.t('moderationGroup'), this.mapCommandsByGroup('moderation'))
      .addField(ctx.t('settingsGroup'), this.mapCommandsByGroup('settings'))
      .addField(ctx.t('devGroup'), this.mapCommandsByGroup('dev'))
      .setColor(ctx.get('embColor'))
      .setFooter({
        text: 'Zeolite © Fishyrene',
        iconURL: this.client.user.avatarURL(),
      });

    await ctx.reply({ embeds: [embed] });
  }

  private mapCommandsByGroup(groupName: string): string {
    return [...this.client.commandsManager.commands.values()]
      .filter((c) => c.group == groupName)
      .map((c) => `\`${c.name}\``)
      .join(', ');
  }
}
