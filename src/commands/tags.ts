import { ZeoliteClient, ZeoliteCommand, ZeoliteContext, Embed, ActionRow, ZeoliteInteractionCollector } from "zeolitecore";
import Tags from '../dbModels/Tags';
import { ComponentInteraction } from 'eris';

export default class TagsCommand extends ZeoliteCommand {
  public constructor(client: ZeoliteClient) {
    super(client, {
      name: 'tags',
      description: 'Lets you to manage the tags',
      group: 'other',
      options: [
        {
          type: 1,
          name: 'get',
          description: 'Get the tag',
          options: [
            {
              type: 3,
              name: 'tag',
              description: 'Tag name',
              required: true,
            },
            {
              type: 5,
              name: 'silent',
              description: 'Respond with an ephemeral message',
              required: false,
            },
          ],
        },
        {
          type: 1,
          name: 'add',
          description: 'Adds the tag',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'Tag name',
              required: true,
            },
            {
              type: 3,
              name: 'content',
              description: "Tag text (obvious, isn't it?)",
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'edit',
          description: 'Edits the existing tag',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'Tag name',
              required: true,
            },
            {
              type: 3,
              name: 'newcontent',
              description: 'New tag text',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'rename',
          description: 'Renames the tag',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'Tag name',
              required: true,
            },
            {
              type: 3,
              name: 'newname',
              description: 'New tag name',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'transfer',
          description: 'Transfers tag to other user',
          options: [
            {
              type: 3,
              name: 'tag',
              description: 'Tag name',
              required: true,
            },
            {
              type: 6,
              name: 'newowner',
              description: 'New tag owner',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'owner',
          description: 'Information about tag owner',
          options: [
            {
              type: 3,
              name: 'tag',
              description: 'Tag name',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'delete',
          description: 'Deletes the tag',
          options: [
            {
              type: 3,
              name: 'tag',
              description: 'Tag name',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'list',
          description: 'Shows full list of tags',
        },
      ],
      guildOnly: true,
    });
  }

  public async run(ctx: ZeoliteContext) {
    const subcommand = ctx.options.getSubcommand();

    switch (subcommand) {
      case 'add': {
        const name = ctx.options.getString('name')!;
        const content = ctx.options.getString('content')!;

        if (name.length > 128) {
          await ctx.reply({
            content: ctx.t('tagNameTooLong'),
            flags: 64,
          });
          return;
        }

        let tag = await Tags.findOne({
          where: { guildID: ctx.guild?.id, name },
        });
        if (tag) {
          await ctx.reply({
            content: ctx.t('tagAlreadyExist'),
            flags: 64,
          });
          return;
        }

        await Tags.create({
          guildID: ctx.guild?.id,
          userID: ctx.user!.id,
          name,
          content,
        });

        await ctx.reply(ctx.t('tagAddSuccess', name));
        break;
      }

      case 'get': {
        const name = ctx.options.getString('tag');
        const silent = ctx.options.getBoolean('silent') || false;

        const tag = await Tags.findOne({
          where: { guildID: ctx.guild?.id, name },
        });
        if (!tag) {
          await ctx.reply({ content: ctx.t('tagNotExist'), flags: 64 });
          return;
        }

        await ctx.reply({ content: tag.content, flags: silent ? 64 : 0 });
        break;
      }

      case 'edit': {
        const name = ctx.options.getString('name')!;
        const content = ctx.options.getString('newcontent')!;

        const tag = await Tags.findOne({
          where: { guildID: ctx.guild?.id, name },
        });
        if (!tag || tag.userID != ctx.user!.id) {
          await ctx.reply({ content: ctx.t('tagsNotOwner'), flags: 64 });
          return;
        }

        await tag.update({ content });

        await ctx.reply(ctx.t('tagEditSuccess', name));
        break;
      }

      case 'rename': {
        const name = ctx.options.getString('name')!;
        const newName = ctx.options.getString('newname')!;

        if (newName.length > 128) {
          await ctx.reply({
            content: ctx.t('tagNewNameTooLong'),
            flags: 64,
          });
          return;
        }

        const tag = await Tags.findOne({
          where: { guildID: ctx.guild?.id, name },
        });
        if (!tag || tag.userID != ctx.user!.id) {
          await ctx.reply({ content: ctx.t('tagsNotOwner'), flags: 64 });
          return;
        }

        if (newName == tag.name) {
          await ctx.reply({ content: ctx.t('tagsSameName'), flags: 64 });
          return;
        }

        await tag.update({ name: newName });
        await ctx.reply(ctx.t('tagRenameSuccess', name, newName));
        break;
      }

      case 'transfer': {
        const name = ctx.options.getString('tag')!;
        const newOwner = ctx.options.getUser('newowner')!;

        const tag = await Tags.findOne({
          where: { guildID: ctx.guild?.id, name },
        });
        if (!tag || tag.userID != ctx.user!.id) {
          await ctx.reply({ content: ctx.t('tagsNotOwner'), flags: 64 });
          return;
        }

        if (newOwner.id == ctx.user!.id) {
          await ctx.reply({
            content: ctx.t('alreadyOwnTag', name),
            flags: 64,
          });
          return;
        }

        await tag.update({ userID: newOwner.id });

        await ctx.reply(ctx.t('tagTransferSuccess', name, `${newOwner.username}#${newOwner.discriminator}`));
        break;
      }

      case 'owner': {
        const name = ctx.options.getString('tag')!;

        const tag = await Tags.findOne({
          where: { guildID: ctx.guild?.id, name },
        });
        if (!tag) {
          await ctx.reply({ content: ctx.t('tagNotExist'), flags: 64 });
          return;
        }

        const owner = await (this.client.users.get(tag.userID) || this.client.getRESTUser(tag.userID));

        await ctx.reply(ctx.t('tagOwnerInfo', name, `${owner.username}#${owner.discriminator}`));
        break;
      }

      case 'delete': {
        const name = ctx.options.getString('tag')!;

        const tag = await Tags.findOne({
          where: { guildID: ctx.guild?.id, name },
        });
        if (!tag || tag.userID != ctx.user!.id) {
          await ctx.reply({ content: ctx.t('tagsNotOwner'), flags: 64 });
          return;
        }

        await tag.destroy();
        await ctx.reply(ctx.t('tagDeleted', name));
        break;
      }

      case 'list': {
        const tags = await Tags.findAll({
          where: { guildID: ctx.guild?.id },
        }).then((t) => t.map((u, i) => `${i + 1}: \`${u.name}\``));

        const total = tags.length;

        const pages: string[][] = [];
        while (tags.length) {
          const arr: string[] = [];
          for (const tag of tags.splice(0, 15)) {
            arr.push(tag);
          }
          pages.push(arr);
        }

        const embed = new Embed()
          .setTitle(ctx.t('tagsList'))
          .setDescription(pages[0]?.join('\n') || ctx.t('tagsEmpty'))
          .setColor(ctx.get('embColor'));

        let actionRow: ActionRow | undefined;
        if (pages.length > 1) {
          let pageNum = 0;

          /*actionRow = new MessageActionRow().addComponents(
            new MessageButton().setLabel(ctx.t('back')).setCustomId('back').setStyle('PRIMARY'),
            new MessageButton().setLabel(ctx.t('forward')).setCustomId('forward').setStyle('PRIMARY'),
            new MessageButton().setLabel(ctx.t('close')).setCustomId('close').setStyle('DANGER'),
          );*/
          actionRow = new ActionRow(
            {
              type: 2,
              label: ctx.t('back'),
              custom_id: 'back',
              style: 1,
            },
            {
              type: 2,
              label: ctx.t('forward'),
              custom_id: 'forward',
              style: 1,
            },
            {
              type: 2,
              label: ctx.t('close'),
              custom_id: 'close',
              style: 4,
            },
          );

          await ctx.reply({ embeds: [embed], components: [actionRow] });
          const msg = await ctx.interaction.getOriginalMessage();

          const collector = new ZeoliteInteractionCollector(this.client, {
            filter: (i) => i.member!.id == ctx.user!.id,
            time: 600000,
            message: msg,
          });

          collector.on('collect', (interaction: ComponentInteraction) => {
            switch (interaction.data.custom_id) {
              case 'back': {
                if (pageNum == 0) return;
                pageNum--;
                break;
              }
              case 'forward': {
                if (pageNum == pages.length - 1) return;
                pageNum++;
                break;
              }
              case 'close': {
                collector.stop();
                ctx.deleteReply();
                return;
              }
            }

            embed.setDescription(pages[pageNum].join('\n'));
            interaction.editParent({ embeds: [embed] });
          });
        } else {
          await ctx.reply({ embeds: [embed] });
        }
        break;
      }
    }
  }
}
