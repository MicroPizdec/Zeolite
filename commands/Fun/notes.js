async function getNote(name, author) {
  return notes.findOne({ where: { name, author } });
}

async function addNote(name, content, author) {
  return notes.create({
    name,
    content,
    author,
  });
}

async function getNotesList(author) {
  return notes.findAll({ where: { author } })
    .then((n) => {
      return n.map((a, i) => `${i + 1}. \`${a.name}\``).join("\n")
    });
}

async function updateNote(author, name, content) {
  return notes.update({
    content,
  }, { where: { author, name } });
}

async function deleteNote(note) {
  return note.destroy();
};


const forbiddenNames = [ "add", "delete", "edit", "list" ];

module.exports = {
  name: "notes",
  group: "FUN_GROUP",
  description: "NOTES_DESCRIPTION",
  usage: "NOTES_USAGE",
  async run(client, msg, args, prefix, lang) {
    let subcommand = args.shift();
    if (subcommand === "add") {
      let noteName = args.shift();
      if (!noteName) {
        return msg.channel.createMessage(_(lang, "NOTES_ADD_USAGE", prefix));
      }
      if (forbiddenNames.includes(noteName)) {
        return msg.channel.createMessage(_(lang, "NOTES_INVALID_NAME"));
      }

      let note = await getNote(noteName, msg.author.id);
      if (!note) {
        let noteContent = args.join(' ');
        if (!noteContent.length) {
          return msg.channel.createMessage(_(lang, "NOTES_NO_CONTENT"));
        }
        await addNote(noteName, noteContent, msg.author.id);
        await msg.channel.createMessage(_(lang, "NOTE_ADD_SUCCESS", noteName));
      } else {
        await msg.channel.createMessage(_(lang, "NOTE_ALREADY_EXIST"));
      }
    } else if (subcommand === "list") {
      let list = await getNotesList(msg.author.id);
      if (!list) {
        return msg.channel.createMessage(_(lang, "NOTES_NO_NOTES"));
      }

      let embed = {
        title: _(lang, "NOTES_LIST"),
        description: list,
      };
      await msg.channel.createEmbed(embed);
    } else if (subcommand === "edit") {
      let noteName = args.shift();
      if (!noteName) {
        return msg.channel.createMessage(_(lang, "NOTES_EDIT_USAGE", prefix));
      }

      let note = await getNote(noteName, msg.author.id);
      if (!note) {
        return msg.channel.createMessage(_(lang, "NOTE_NOT_FOUND"));
      }

      let newContent = args.join(' ');
      if (!newContent) {
        return msg.channel.createMessage(_(lang, "NOTES_NO_CONTENT"));
      }

      await updateNote(msg.author.id, noteName, newContent);
      await msg.channel.createMessage(_(lang, "NOTE_EDIT_SUCCESS", noteName));
    } else if (subcommand === "delete") {
      let noteName = args.shift();
      if (!noteName) {
        return msg.channel.createMessage(_(lang, "NOTES_DELETE_USAGE", prefix));
      }

      let note = await getNote(noteName, msg.author.id);
      if (!note) {
        return msg.channel.createMessage(_(lang, "NOTE_NOT_FOUND"));
      }
      await deleteNote(note);
      await msg.channel.createMessage(_(lang, "NOTE_DELETE_SUCCESS", noteName));
    } else {
      if (subcommand) {
        let note = await getNote(subcommand, msg.author.id);
        if (!note) {
          return msg.channel.createMessage(_(lang, "NOTE_NOT_FOUND"));
        }
        await msg.channel.createMessage(note.content);
      } else {
        let embed = {
          title: _(lang, "NOTES_USAGE_EMBED"),
          description: _(lang, "NOTES_USAGE_EMBED_DESCRIPTION", prefix),
          color: Math.round(Math.random() * 16777216),
          footer: {
            text: `${client.user.username} © ZariBros`,
            icon_url: client.user.avatarURL,
          },
        }
        await msg.channel.createEmbed(embed);
      }	
    }
  }
}
