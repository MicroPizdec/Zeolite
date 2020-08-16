module.exports = {
  GUILD_ONLY_COMMAND: "> :x: You cannot use this command in DM.",
  INVALID_USER_PROVIDED: "> :x: Invalid user provided.",
  BASIC_GROUP: "Basic commands",
  FUN_GROUP: "Fun commands",
  ZETCOINS_GROUP: "ZetCoins",
  DEV_GROUP: "Dev commands",
  SETTINGS_GROUP: "Settings",
  PING_COMMAND_DESCRIPTION: "bot ping",
  PING_EMBED_TITLE: "Bot ping:",
  PING_EMBED_DESCRIPTION: latency => `${latency} ms.`,
  HELP_COMMAND_DESCRIPTION: "bot commands",
  HELP_EMBED_TITLE: (page, max) => `Bot commands (Page ${page} of ${max})`,
  HELP_EMBED_TITLE_OWNER_ONLY: "Bot commands (Owner only)",
  HELP_COMMAND_DOESNT_EXIST: (name, prefix) => `Command \`${prefix}${name}\` does not exist.`,
  HELP_COMMAND_DOESNT_EXIST_DESC: prefix => `Type \`${prefix}help\` to get a list of commands.`,
  HELP_COMMAND_TITLE: (name, prefix) => `\`${prefix}${name}\` help`,
  HELP_USAGE: "Usage",
  HELP_ALIASES: "Aliases",
  SERVERINFO_COMMAND_DESCRIPTION: "server information",
  SERVERINFO_CREATION_DATE: "Creation date",
  SERVERINFO_DATE_OF_YOUR_JOIN: "Date of your join",
  SERVERINFO_CHANNELS: "Channels",
  SERVERINFO_MEMBERS: "Members",
  SERVERINFO_BOTS: "Bots",
  SERVERINFO_ROLES: "Roles",
  SERVERINFO_REGION: "Region",
  STATUS_COMMAND_DESCRIPTION: "bot stats",
  STATUS_EMBED_TITLE: "Stats",
  STATUS_UPTIME: "Uptime",
  STATUS_SERVERS: "Servers",
  STATUS_USERS: "Users",
  STATUS_LIBRARIES: "Used libraries",
  STATUS_PLATFORM: "Platform",
  USERINFO_COMMAND_DESCRIPTION: "information about user (or you, if no user provided)",
  USERINFO_COMMAND_USAGE: "[user]",
  USERINFO_STATUS: "Status",
  USERINFO_REGDATE: "Registration date",
  USERINFO_ROLES: "Roles",
  USERINFO_BOT_TITLE: "Bot?",
  USERINFO_BOT_DEFINE: bot => bot ? "Yes" : "No",
  USERINFO_ZETCOINS_TITLE: "ZetCoins balance",
  USERINFO_ZETCOINS_BALANCE: amount => `${amount} ZetCoins`,
  USERINFO_CREATED_DAYS_AGO: days => `(${days} days ago)`,
  _8BALL_COMMAND_DESCRIPTION: "a magic 8 ball",
  _8BALL_COMMAND_USAGE: "<question>",
  _8BALL_NO_ARGS_PROMPT: prefix => `> :x: What question do you want to ask to magic ball? Use \`${prefix}8ball <question>\``,
  _8BALL_EMBED_TITLE: question => `:question: Your question: ${question}`,
  _8BALL_2_WORDS: "> :x: Question must have at least 2 words.",
  CFLIP_COMMAND_DESCRIPTION: "coin flip",
  CFLIP_HEADS: "Heads",
  CFLIP_TAILS: "Tails",
  CFLIP_SIDEWAYS: "Sideways",
  CFLIP_EMBED_TITLE: "The coin is landed:",
  SAY_COMMAND_DESCRIPTION: "says your text",
  SAY_COMMAND_USAGE: "<text>",
  SAY_NO_ARGS_PROMPT: prefix => `> :x: What do you want to say? Use ${prefix}say <text>`,
  BANNED_BALANCE: ":x: Your balance is banned",
  BANNED_BALANCE_REASON: reason => `Reason: ${reason || "not provided"}`,
  BALANCE_COMMAND_DESCRIPTION: "shows your (or provided user's) ZetCoins balance",
  BALANCE_COMMAND_USAGE: "[user]",
  BALANCE_EMBED_AUTHOR_NAME: user => `${user.username}#${user.discriminator}'s balance:`,
  BALANCE_EMBED_DESCRIPTION: amount => `${amount} ZetCoins.`,
  BALANCE_ALREADY_BANNED: user => `${user.username}#${user.discriminator}'s balance is banned.`,
  BANBALANCE_COMMAND_DESCRIPTION: "bans the provided user's balance",
  BANBALANCE_COMMAND_USAGE: "<user> [reason",
  BANBALANCE_EMBED_TITLE: user => `:white_check_mark: Successfully banned ${user.username}#${user.discriminator}'s balance.`,
  BANBALANCE_EMBED_DESCRIPTION: reason => `Reason: ${reason || "not provided"}`,
  SENDCOINS_COMMAND_DESCRIPTION: "sends an amoumt of ZetCoins to user",
  SENDCOINS_COMMAND_USAGE: "<user> <amount>",
  SENDCOINS_NO_ARGS_PROMPT: prefix => `> :x: What user you want to send ZetCoins to? Use \`${prefix}sendcoins <user> <amount>\``,
  SENDCOINS_NO_AMOUNT: "> :x: Please provide an amount of ZetCoins that you want to send.",
  SENDCOINS_AMOUNT_IS_NAN: "> :x: Provided amount is not a number.",
  SENDCOINS_CONFIRMATION_TITLE: (amount, user) => `Are you really want to send ${amount} ZetCoins to **${user.username}#${user.discriminator}**`,
  SENDCOINS_CONFIRMATION_DESCRIPTION: "Type 'yes' or 'no'. You have 30 seconds to agree.",
  SENDCOINS_SUCCESSFULLY_SENT: (amount, user) => `:white_check_mark: Successfully sent ${amount} ZetCoins to **${user.username + "#" + user.discriminator}**.`,
  SENDCOINS_CANCELLED_TRANSACTION: `:x: You cancelled the transaction.`,
  SENDCOINS_NOT_ENOUGH_MONEY: amount => `> :x: You don't have enough money. Your balance: ${amount} ZetCoins.`,
  CANNOT_SEND_COINS_TO_SELF: "> :x: You can't send ZetCoins to self.",
  SETBALANCE_COMMAND_DESCRIPTION: "sets the provided user's balance",
  SETBALANCE_COMMAND_USAGE: "<user> <amount>",
  SETBALANCE_NO_ARGS_PROMPT: prefix => `> Which user do you want to change the balance? Use ${prefix}setbalance <user> <amount>`,
  SETBALANCE_NO_AMOUNT: "> :x: Please provide an amount of ZetCoins you want to set.",
  SETBALANCE_AMOUNT_IS_NAN: "> :x: Provided amount is not a number.",
  SETBALANCE_EMBED_TITLE: user => `:white_check_mark: Successfully set the ${user.username + "#" + user.discriminator}'s balance.`,
  SETBALANCE_EMBED_DESCRIPTION: amount => `Now this user has ${amount} ZetCoins.`,
  TOP_COMMAND_DESCRIPTION: "top-10 of richest users in the server",
  TOP_EMBED_TITLE: "Top-10 of richest users in the server",
  TOP_BALANCE: balance => `${balance} ZetCoins.`,
  UNBANBALANCE_COMMAND_DESCRIPTION: "unbans the provided user's balance",
  UNBANBALANCE_COMMAND_USAGE: "<user>",
  UNBANBALANCE_SUCCESSFUL_UNBAN: user => `> :white_check_mark: Successfully unbanned ${user.username + "#" + user.discriminator}'s balance.`,
  WORK_COMMAND_DESCRIPTION: "earn from 100 to 400 ZetCoins (1 time per hour)",
  WORK_COOLDOWN: "> :x: You can't work more than 1 time per hour.",
  WORK_EMBED_TITLE: ":money_with_wings: You earned:",
  WORK_EMBED_DESCRIPTION: amount => `${amount} ZetCoins.`,
  POLL_COMMAND_DESCRIPTION: "creates a reaction poll (up to 10 answers)",
  POLL_COMMAND_USAGE: "<question> <answers>",
  POLL_NO_ARGS_PROMPT: prefix => `> :x: What is the title of the poll? Use \`${prefix}poll <question> <answers>\` (up to 10 answers)`,
  POLL_NOT_MORE_THAN_10_ANSWERS: "> :x: Not more than 10 answers.",
  POLL_NO_ANSWERS: prefix => `> :x: Where are the answers? Use \`${prefix}poll <question> <answers>\` (up to 10 answers)`,
  POLL_STARTED_BY: user => `Started by ${user.username}#${user.discriminator}`,
  LANGUAGE_COMMAND_DESCRIPTION: "sets the bot's language in server",
  LANGUAGE_COMMAND_USAGE: "[lang]",
  LANGUAGE_EMBED_TITLE: "Languages:",
  LANGUAGE_LIST: "```en: English\nru: Russian```",
  LANGUAGE_IS_NOT_EXIST: "> :x: This language doesn't exist.",
  LANGUAGE_SUCCESSFUL_SET: lang => `> :white_check_mark: Language is successfully set to \`${lang}\``,
  MISSING_PERMISSION: ":x: You don't have the permissions to use this command.",
  MISSING_PERMISSION_DESCRIPTION: permission => `Missing permission: \`${permission}\``,
  DICE_COMMAND_DESCRIPTION: "win or lose the amount of ZetCoins",
  DICE_COMMAND_USAGE: "<amount>",
  DICE_NO_ARGS_PROMPT: prefix => `> :x: How much ZetCoins you want to bet? Use \`${prefix}dice <amount>\``,
  DICE_NOT_ENOUGH_MONEY: balance => `> :x: You don't have enough ZetCoins. Your balance: ${balance} ZetCoins.`,
  DICE_AMOUNT_IS_NAN: "> :x: Provided amount is not a number.",
  DICE_WIN: ":money_with_wings: Win!",
  DICE_WIN_MESSAGE: (amount, balance) => `You won: **${amount}** ZetCoins\nYour balance: **${balance + amount}** ZetCoins`,
  DICE_LOSS: ":money_with_wings: Loss",
  DICE_LOSS_MESSAGE: (amount, balance) => `You lost: **${amount}** ZetCoins\nYour balance: **${balance - amount}** ZetCoins`,
  DICE_MORE_THAN_ZERO: "> :x: Amount should be more than 0.",
  DM_COMMAND_DESCRIPTION: "sends the text to provided user",
  DM_COMMAND_USAGE: "<user> <text>",
  DM_NO_ARGS_PROMPT: prefix => `> :x: What do you want to send? Use \`${prefix}dm <user> <message>\``,
  DM_NO_CONTENT_TO_SEND: `> :x: Please provide the text you want to send.`,
  DM_ANSWER_SENT: "Answer sent:",
  EVAL_COMMAND_DESCRIPTION: "evaluates the JavaScript code",
  EVAL_COMMAND_USAGE: "<code>",
  LINKS_COMMAND_DESCRIPTION: "some useful links",
  LINKS_EMBED_TITLE: "Links",
  LINKS_EMBED_DESCRIPTION: "[Bot invite](https://discordapp.com/oauth2/authorize?client_id=679692205736460301&scope=bot&permissions=8)\n[Support server](https://discord.gg/e6V38mv)",
  COMMANDS_BANNED: ":x: Commands are banned",
  COMMANDS_BANNED_REASON: reason => `Reason: ${reason || "none"}`,
  BANCOMMANDS_COMMAND_DESCRIPTION: "bans the commands for provided user",
  BANCOMMANDS_COMMAND_USAGE: "<user> [reason]",
  BANCOMMANDS_NO_ARGS_PROMPT: prefix => `> :x: What user do you want to ban commands? Use \`${prefix}bancommands <user> [reason]\``,
  BANCOMMANDS_CANT_BAN_SELF: "> :x: You can't ban commands for yourself.",
  BANCOMMANDS_CANT_BAN_OTHER_BOT_OWNER: "> :x: You can't ban commands for other bot owner.",
  BANCOMMANDS_USER_ALREADY_BANNED: "> :x: This user is already banned.",
  BANCOMMANDS_SUCCESSFUL_BAN: user => `Successfully banned commands for ${user.username}#${user.discriminator}`,
  BANCOMMANDS_BAN_REASON: reason => `Reason: ${reason || "none"}`,
  UNBANCOMMANDS_DESCRIPTION: "unbans commands for provided user",
  UNBANCOMMANDS_USAGE: "<user>",
  UNBANCOMMANDS_NO_ARGS_PROMPT: prefix => `> :x: What user do you want to unban commands? Use \`${prefix}unbancommands <user>\``,
  UNBANCOMMANDS_USER_ISNT_BANNED: "> :x: This user isn't banned.",
  UNBANCOMMANDS_SUCCESSFUL_UNBAN: user => `:white_check_mark: Successfully unbanned commands for ${user.username}#${user.discriminator}`,
  AVATAR_DESCRIPTION: "gets your or someone's avatar. -s key also gets the server icon",
  AVATAR_USAGE: "[-s] or [user]",
  AVATAR_USER: user => `Avatar of ${user.username}#${user.discriminator}`,
  SERVER_ICON: "Server icon:",
  NOTES_DESCRIPTION: "lets you to manage your notes",
  NOTES_USAGE: "[subcommand]",
  NOTES_ADD_USAGE: prefix => `> :x: What note you want to add? Use \`${prefix}notes add <name> <content>\``,
  NOTES_INVALID_NAME: "> :x: You can't create a note with this name.",
  NOTES_NO_CONTENT: "> :x: You can't create a note with empty content.",
  NOTE_ADD_SUCCESS: name => `> :white_check_mark: Added note \`${name}\`.`,
  NOTE_ALREADY_EXIST: "> :x: This note is already exist.",
  NOTES_LIST: ":notepad_spiral: Your notes",
  NOTES_EDIT_USAGE: prefix => `> :x: What note you want to edit? Use \`${prefix}notes edit <name> <newcontent>\``,
  NOTE_NOT_FOUND: "> :x: Note not found.",
  NOTE_EDIT_SUCCESS: name => `> :white_check_mark: Edited note \`${name}\`.`,
  NOTES_DELETE_USAGE: prefix => `> :x: What note you want to delete? Use \`${prefix}notes delete <name>\``,
  NOTE_DELETE_SUCCESS: name => `> :white_check_mark: Deleted note \`${name}\`.`,
  NOTES_USAGE_EMBED: "Notes help",
  NOTES_USAGE_EMBED_DESCRIPTION: prefix => {
      return `\`${prefix}notes <name>\` - get a note\n` +
        `\`${prefix}notes add <name> <content>\` - add a note\n` +
        `\`${prefix}notes edit <name> <newcontent>\` - edit a existing note\n` +
        `\`${prefix}notes delete <name>\` - delete a note\n` +
        `\`${prefix}notes list\` - your notes list`;
    },
  NOTES_NO_NOTES: "> You don't have any notes.",
  LIMITCMD_DESCRIPTION: "limit the specified command",
  LIMITCMD_USAGE: "<command>",
  LIMITCMD_NO_ARGS_PROMPT: prefix => `> :x: What command do you want to limit? Use \`${prefix}limitcmd <command>\``,
  LIMITCMD_INVALID_COMMAND: "> :x: This command does not exist or this is an owner-only command.",
  COMMAND_ALREADY_LIMITED: "> :x: This command is already limited.",
  LIMITCMD_SUCCESS: name => `> :white_check_mark: Successfully limited \`${name}\` command.`,
  UNLIMITCMD_DESCRIPTION: "unlimit the limited command",
  UNLIMITCMD_USAGE: "<command>",
  UNLIMITCMD_NO_ARGS_PROMPT: prefix => `> :x: What command you want to unlimit? Use \`${prefix}unlimitcmd <command>\``,
  UNLIMITCMD_INVALID_COMMAND: "> :x: This command does not exist.",
  UNLIMITCMD_NOT_LIMITED: "> :x: This command is not limited.",
  UNLIMITCMD_SUCCESS: name => `> :white_check_mark: Successfully unlimited \`${name}\` command.`,
  SUPPORT_DESCRIPTION: "send question to bot developers",
  SUPPORT_USAGE: "<question>",
  SUPPORT_NO_ARGS_PROMPT: prefix => `> :x: What question do you want to ask? Use \`${prefix}support <question>\``,
  SUPPORT_EMPTY_QUESTION: "> :warning: Question can't be empty.",
  SUPPORT_SUCCESS: ":white_check_mark: Your question has been sent to developers.",
  SUPPORT_SUCCESS_DESC: ":clock9: It may take some time. Please, make a tea and wait, so it takes from 5 to 10 minutes.",
  RESPOND_DESCRIPTION: "respond to question",
  RESPOND_USAGE: "<id> <answer>",
  RESPOND_NO_ARGS_PROMPT: prefix => `> :x: What question do you want to answer? Use \`${prefix} respond <id> <answer>\``,
  RESPOND_INVALID_ID: "> :x: Invalid ID.",
  RESPOND_SENT: ":mailbox_with_mail: Answer sent:",
  RESPOND_YOUR_QUESTION: "Your question:",
  LANG_DESCRIPTION: "changes your language",
  LANG_USAGE: "[language]",
  LANG_AVAILABLE_LANGUAGES: "Available languages:",
  LANG_YOUR_LANGUAGE: "Your language:",
  LANG_DEPENDING: "Currently it is depending on server default language",
  LANG_FOOTER: prefix => `You can change the language by using ${prefix}lang [language]`,
  LANG_NOT_EXIST: "> :x: This lang is not exist.",
  LANG_SUCCESS: "> :white_check_mark: Your language has been changed to `en`",
  SERVERLANG_DESCRIPTION: "changes default server language",
  SERVERLANG_USAGE: "[language]",
  SERVERLANG_LANGUAGE: "Server language:",
  SERVERLANG_FOOTER: prefix => `You can change the server language by using ${prefix}serverlang [language]`,
  SERVERLANG_SUCCESS: lang => `> :white_check_mark: Server language has been changed to \`${lang}\``,
  WHATIF_DESCRIPTION: "what if?",
  WHATIF_USAGE: "<smth>",
  WHATIF_NO_ARGS: prefix => `> :x: What if? Use \`${prefix}whatif <smth>\``,
  WHATIF_2_WORDS: "> :x: Not less than 2 words.",
  WHATIF_EMBED_TITLE: ":grey_question: What if?",
  WHATIF_EMBED_DESC: smth => `What if ${smth}?`,
  WHATIF_ANSWER: "My intuition tells me...",
  WHATIF_FOOTER: "We are not responsible for answers, so don't repeat it.",
  INVITE_DESCRIPTION: "gets information on invite",
  INVITE_USAGE: "<invite>",
  INVITE_NO_ARGS: prefix => `> :x: What invite you want to get info on? Use \`${prefix}invite <invite>\``,
  INVITE_INVALID: "> :x: Invite is invalid or expired.",
  INVITE_MEMBERS: "Members:",
  INVITE_VERIFICATION_LEVEL: "Verification level:",
  INVITE_VERIFICATION_LEVELS: [
    "None",
    "Low",
    "Medium",
    "High",
    "Very high",
  ],
  INVITE_CHANNEL: "Channel:",
  INVITE_INVITER: "Inviter:",
  INVITE_CODE: code => `Code: ${code}`,
};
