import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed } from 'zeolitecore';
import axios from 'axios';

export default class GithubCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'github',
      description: 'Shows info about GitHub repository',
      group: 'other',
      options: [
        {
          type: 3,
          name: 'repo',
          description: 'Repository name or URL',
          required: true,
        },
      ],
    });
  }

  public async run(ctx: ZeoliteContext) {
    if (!config.githubApiKey) {
      throw new Error("GitHub API key isn't present in the config.");
    }

    await ctx.defer();

    const repo = ctx.options.getString('repo')!;

    const response = await axios({
      url: `https://api.github.com/search/repositories?q=${encodeURIComponent(repo)}`,
      headers: { Authorization: `token ${config.githubApiKey}` },
    }).then((r) => r.data);

    if (!response.total_count) {
      await ctx.editReply({ content: ctx.t('githubRepoNotFound') });
      return;
    }

    const data = response.items[0];

    const embed = new Embed()
      .setAuthor({ name: data.full_name, url: data.html_url })
      .setThumbnail(data.owner.avatar_url)
      .setColor(ctx.get('embColor'))
      .addField(ctx.t('githubStars'), data.stargazers_count.toString(), true)
      .addField(ctx.t('githubForks'), data.forks.toString(), true)
      .addField(ctx.t('githubWatchers'), data.watchers.toString(), true)
      .setFooter({ text: ctx.t('githubCreatedAt') })
      .setTimestamp(new Date(data.created_at).toISOString());

    if (data.description) embed.setDescription(data.description);

    if (data.topics.length) {
      embed.addField(
        ctx.t('githubTopics'),
        data.topics.map((t: any) => `[\`${t}\`](https://github.com/topics/${t})`).join(', '),
      );
    }

    if (data.license) {
      embed.addField(ctx.t('githubLicense'), data.license.name);
    }

    if (data.language) {
      embed.addField(ctx.t('githubLanguage'), data.language);
    }

    if (data.archived) {
      embed.setAuthor({
        name: `${data.full_name} ${ctx.t('githubArchived')}`,
        url: data.html_url,
      });
    }

    await ctx.editReply({ embeds: [embed] });
  }
}
