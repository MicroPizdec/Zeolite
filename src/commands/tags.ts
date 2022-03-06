import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageActionRowComponent,
  User,
  InteractionCollector,
  ButtonInteraction
} from "discord.js";
import ZeoliteCommand from "../core/ZeoliteCommand";
import ZeoliteContext from "../core/ZeoliteContext";
import Tags from "../dbModels/Tags";

export default class TagsCommand extends ZeoliteCommand {
  name = "tags";
  description = "Lets you to manage the tags";
  group = "other";
  options = [
    {
      type: 1,
      name: "get",
      description: "Get the tag",
      options: [
        {
          type: 3,
          name: "tag",
          description: "Tag name",
          required: true,
        },
        {
          type: 5,
          name: "silent",
          description: "Respond with an ephemeral message",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "add",
      description: "Adds the tag",
      options: [
        {
          type: 3,
          name: "name",
          description: "Tag name",
          required: true,
        },
        {
          type: 3,
          name: "content",
          description: "Tag text (obvious, isn't it?)",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "edit",
      description: "Edits the existing tag",
      options: [
        {
          type: 3,
          name: "name",
          description: "Tag name",
          required: true,
        },
        {
          type: 3,
          name: "newcontent",
          description: "New tag text",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "rename",
      description: "Renames the tag",
      options: [
        {
          type: 3,
          name: "name",
          description: "Tag name",
          required: true,
        },
        {
          type: 3,
          name: "newname",
          description: "New tag name",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "transfer",
      description: "Transfers tag to other user",
      options: [
        {
          type: 3,
          name: "tag",
          description: "Tag name",
          required: true,
        },
        {
          type: 6,
          name: "newowner",
          description: "New tag owner",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "owner",
      description: "Information about tag owner",
      options: [
        {
          type: 3,
          name: "tag",
          description: "Tag name",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "delete",
      description: "Deletes the tag",
      options: [
        {
          type: 3,
          name: "tag",
          description: "Tag name",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "list",
      description: "Shows full list of tags",
    },
  ];

  async run(ctx: ZeoliteContext) {
    const subcommand = ctx.interaction.options.getSubcommand();

    switch (subcommand) {
      case "add": {
        const name = ctx.options.getString("name", true);
        const content = ctx.options.getString("content", true);

        if (name.length > 128) {
          await ctx.reply({ content: ctx.t("tagNameTooLong"), ephemeral: true });
          return;
        }

        let tag = await Tags.findOne({ where: { guildID: ctx.guild?.id, name } });
        if (tag) {
          await ctx.reply({ content: ctx.t("tagAlreadyExist"), ephemeral: true });
          return;
        }

        await Tags.create({
          guildID: ctx.guild?.id,
          userID: ctx.user.id,
          name,
          content,
        });

        await ctx.reply(ctx.t("tagAddSuccess", name));
        break;
      }

      case "get": {
        const name = ctx.options.getString("tag", true)
        const silent = ctx.options.getBoolean("silent") || false;

        const tag = await Tags.findOne({ where: { guildID: ctx.guild?.id, name } });
        if (!tag) {
          await ctx.reply({ content: ctx.t("tagNotExist"), ephemeral: true });
          return;
        }

        await ctx.reply({ content: tag.content, ephemeral: silent }); // потом поменяем
        break;
      }

      case "edit": {
        const name = ctx.options.getString("name", true);
        const content = ctx.options.getString("newcontent", true);

        const tag = await Tags.findOne({ where: { guildID: ctx.guild?.id, name } });
        if (!tag || tag.userID != ctx.user.id) {
          await ctx.reply({ content: ctx.t("tagsNotOwner"), ephemeral: true });
          return;
        }

        await tag.update({ content });

        await ctx.reply(ctx.t("tagEditSuccess", name));
        break;
      }

      case "rename": {
        const name = ctx.options.getString("name", true);
        const newName = ctx.options.getString("newname", true);

        if (newName.length > 128) {
          await ctx.reply({ content: ctx.t("tagNewNameTooLong"), ephemeral: true });
          return;
        }

        const tag = await Tags.findOne({ where: { guildID: ctx.guild?.id, name } });
        if (!tag || tag.userID != ctx.user.id) {
          await ctx.reply({ content: ctx.t("tagsNotOwner"), ephemeral: true });
          return;
        }

        if (newName == tag.name) {
          await ctx.reply({ content: ctx.t("tagsSameName"), ephemeral: true });
          return;
        }

        await tag.update({ name: newName });
        await ctx.reply(ctx.t("tagRenameSuccess", name, newName));
        break;
      }
      
      case "transfer": {
        const name = ctx.options.getString("tag", true);
        const newOwner = ctx.options.getUser("newowner", true);
        
        const tag = await Tags.findOne({ where: { guildID: ctx.guild?.id, name } });
        if (!tag || tag.userID != ctx.user.id) {
          await ctx.reply({ content: ctx.t("tagsNotOwner"), ephemeral: true });
          return;
        }

        if (newOwner.id == ctx.user.id) {
          await ctx.reply({ content: ctx.t("alreadyOwnTag", name), ephemeral: true })
          return;
        }

        await tag.update({ userID: newOwner.id });

        await ctx.reply(ctx.t("tagTransferSuccess", name, newOwner.tag));
        break;
      }

      case "owner": {
        const name = ctx.options.getString("tag", true);

        const tag = await Tags.findOne({ where: { guildID: ctx.guild?.id, name } });
        if (!tag) {
          await ctx.reply({ content: ctx.t("tagNotExist"), ephemeral: true });
          return;
        }

        const owner = await this.client.users.fetch(tag.userID)

        await ctx.reply(ctx.t("tagOwnerInfo", name, owner.tag));
        break;
      }
      
      case "delete": {
        const name = ctx.options.getString("tag", true);

        const tag = await Tags.findOne({ where: { guildID: ctx.guild?.id, name } });
        if (!tag || tag.userID != ctx.user.id) {
          await ctx.reply({ content: ctx.t("tagsNotOwner"), ephemeral: true });
          return;
        }

        await tag.destroy()
        await ctx.reply(ctx.t("tagDeleted", name))
        break;
      }

      case "list": {
        const tags = await Tags.findAll({ where: { guildID: ctx.guild?.id } })
          .then(t => t.map((u, i) => `${i + 1}: \`${u.name}\``));

        const total = tags.length;

        const pages: string[][] = [];
        while (tags.length) {
          const arr: string[] = [];
          for (const tag of tags.splice(0, 15)) {
            arr.push(tag);
          }
          pages.push(arr);
        }

        const embed = new MessageEmbed()
          .setTitle(ctx.t("tagsList"))
          .setDescription(pages[0].join("\n"))
          .setColor(ctx.get("embColor"));

        let actionRow: MessageActionRow | undefined;
        if (pages.length > 1) {
          let pageNum = 0;

          actionRow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setLabel(ctx.t("back"))
                .setCustomId("back")
                .setStyle("PRIMARY"),
              new MessageButton()
                .setLabel(ctx.t("forward"))
                .setCustomId("forward")
                .setStyle("PRIMARY"),
              new MessageButton()
                .setLabel(ctx.t("close"))
                .setCustomId("close")
                .setStyle("DANGER")
              );
          
          const msg = await ctx.reply({ embeds: [ embed ], components: [ actionRow ], fetchReply: true });

          const collector = new InteractionCollector(this.client, {
            componentType: "BUTTON",
            filter: i => i.user.id == ctx.user.id,
            time: 600000,
          });

          collector.on("collect", (interaction: ButtonInteraction) => {
            switch ((interaction.component as MessageButton).customId) {
              case "back": {
                if (pageNum == 0) return;
                pageNum--;
                break;
              }
              case "forward": {
                if (pageNum == (pages.length - 1)) return;
                pageNum++;
                break;
              }
              case "close": {
                collector.stop();
                ctx.interaction.deleteReply();
                return;
              }
            }
    
            embed.setDescription(pages[pageNum].join("\n"));
            interaction.update({ embeds: [ embed ] });
          });
        } else {
          await ctx.reply({ embeds: [ embed ] });
        }
        break;
      }
    }
  }
}