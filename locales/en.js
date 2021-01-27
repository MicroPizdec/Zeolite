module.exports = {
  COMMAND_ERROR_OCCURRED: ":x: An unknown error occurred while executing the command.",
  COMMAND_ERROR_DESCRIPTION: "This error was sent to the bot developers, and will be fixed as soon as possible.",
  GUILD_ONLY_COMMAND: "> :x: You cannot use this command in DM.",
  INVALID_USER_PROVIDED: "> :x: Invalid user provided.",
  BASIC_GROUP: "Basic commands",
  FUN_GROUP: "Fun commands",
  ZETCOINS_GROUP: "ZetCoins",
  DEV_GROUP: "Dev commands",
  SETTINGS_GROUP: "Settings",
  OTHER_GROUP: "Other commands",
  MODERATION_GROUP: "Moderation commands",
  PING_COMMAND_DESCRIPTION: "bot ping",
  PING_BOT: ping => `Bot ping: ${ping} ms.`,
  PING_API: latency => `API ping: ${latency} ms.`,
  HELP_COMMAND_DESCRIPTION: "bot commands",
  HELP_COMMAND_USAGE: "[command]",
  HELP_EMBED_TITLE: `Bot commands`,
  HELP_EMBED_TITLE_OWNER_ONLY: "Bot commands (Owner only)",
  HELP_EMBED_DESC: prefix => `Want to get more information about some command? Type \`${prefix}help [command]\``,
  HELP_COMMAND_DOESNT_EXIST: (name, prefix) => `Command \`${prefix}${name}\` does not exist.`,
  HELP_COMMAND_DOESNT_EXIST_DESC: prefix => `Type \`${prefix}help\` to get a list of commands.`,
  HELP_COMMAND_TITLE: (name, prefix) => `\`${prefix}${name}\` help`,
  HELP_USAGE: "Usage",
  HELP_ALIASES: "Aliases",
  HELP_PREFIX: prefix => ` | Prefix on this server: ${prefix}`,
  SERVERINFO_COMMAND_DESCRIPTION: "server information",
  SERVERINFO_CREATION_DATE: "Creation date",
  SERVERINFO_DATE_OF_YOUR_JOIN: "Date of your join",
  SERVERINFO_CHANNELS: "Channels",
  SERVERINFO_MEMBERS: "Members",
  SERVERINFO_BOTS: "Bots",
  SERVERINFO_ROLES: "Roles count",
  SERVERINFO_REGION: "Region",
  SERVERINFO_TEXT: "text",
  SERVERINFO_VOICE: "voice",
  SERVERINFO_CATEGORIES: "categories",
  SERVERINFO_MEMBERS_ONLINE: "online",
  SERVERINFO_MEMBERS_IDLE: "idle",
  SERVERINFO_MEMBERS_DND: "do not disturb",
  SERVERINFO_MEMBERS_OFFLINE: "offline",
  SERVERINFO_MEMBERS_BOTS: "bots",
  SERVERINFO_MEMBERS_TOTAL: "total",
  SERVERINFO_EMOJIS: "Emojis",
  SERVERINFO_EMOJIS_STATIC: "static",
  SERVERINFO_EMOJIS_ANIMATED: "animated",
  SERVERINFO_EMOJIS_TOTAL: "total",
  SERVERINFO_VERIFICATION_LEVEL: "Verification level",
  SERVERINFO_VERIFICATION_LEVELS: [
    "None",
    "Low",
    "Medium",
    "High",
    "Very high",
  ],
  SERVERINFO_BOOST_LEVEL: "Boost level",
  SERVERINFO_BOOST_COUNT: "Boosts",
  SERVERINFO_BOOSTERS: "Boosters",
  SERVERINFO_OWNER: "Owner",
  STATS_COMMAND_DESCRIPTION: "bot stats",
  STATS_EMBED_TITLE: "Stats",
  STATS_UPTIME: "Uptime",
  STATS_SERVERS: "Servers",
  STATS_USERS: "Users",
  STATS_LIBRARIES: "Used libraries",
  STATS_PLATFORM: "Platform",
  STATS_RAM_USAGE: "RAM used",
  STATS_MEGABYTES: "MB",
  STATS_CPU: "CPU",
  STATS_CANT_GET_CPU_INFO: "N/A",
  STATS_CHANNELS: "Channels",
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
  USERINFO_JOINDATE: "Join date:",
  USERINFO_STATUSES: {
    online: "<:d_online:737229035914133604> Online",
    idle: "<:d_idle:737229035725258752> Idle",
    dnd: "<:d_dnd:737229034412572712> Do not disturb",
    offline: "<:d_offline:737229034336813156> Offline",
  },
  USERINFO_CUSTOM_STATUS: "Custom status",
  USERINFO_PLAYING: "Playing",
  USERINFO_LISTENING: "Listening to",
  USERINFO_STREAMING: "Streaming",
  USERINFO_WATCHING: "Watching",
  USERINFO_ZETCOINS_TOP: "ZetCoins top position",
  USERINFO_ZETCOINS_TOP_POS: (globalPos, pos) => `global - ${globalPos}\nserver - ${pos}`,
  _8BALL_COMMAND_DESCRIPTION: "a magic 8 ball",
  _8BALL_COMMAND_USAGE: "<question>",
  _8BALL_NO_ARGS_PROMPT: prefix => `> :x: What question do you want to ask to magic ball? Use \`${prefix}8ball <question>\``,
  _8BALL_EMBED_TITLE: question => `:8ball: Magic 8-ball`,
  _8BALL_2_WORDS: "> :x: Question must have at least 2 words.",
  _8BALL_YOUR_QUESTION: "Your question",
  CFLIP_COMMAND_DESCRIPTION: "coin flip",
  CFLIP_HEADS: "Heads",
  CFLIP_TAILS: "Tails",
  CFLIP_SIDEWAYS: "Sideways",
  CFLIP_EMBED_TITLE: "The coin is landed on:",
  SAY_COMMAND_DESCRIPTION: "says your text",
  SAY_COMMAND_USAGE: "<text>",
  SAY_NO_ARGS_PROMPT: prefix => `> :x: What do you want to say? Use ${prefix}say <text>`,
  BANNED_BALANCE: ":x: Your balance is banned",
  BANNED_BALANCE_REASON: reason => `Reason: ${reason || "not provided"}`,
  BALANCE_COMMAND_DESCRIPTION: "shows your (or provided user's) ZetCoins balance",
  BALANCE_COMMAND_USAGE: "[user]",
  BALANCE_EMBED_AUTHOR_NAME: user => `${user.username}#${user.discriminator}'s balance:`,
  BALANCE_EMBED_DESCRIPTION: amount => `<:zetcoins:766959525864669235> ${amount} ZetCoins.`,
  BALANCE_ALREADY_BANNED: user => `${user.username}#${user.discriminator}'s balance is banned.`,
  BALANCE_DEPOSIT: "Deposit",
  BANBALANCE_COMMAND_DESCRIPTION: "bans the provided user's balance",
  BANBALANCE_COMMAND_USAGE: "<user> [reason",
  BANBALANCE_EMBED_TITLE: user => `:white_check_mark: Successfully banned ${user.username}#${user.discriminator}'s balance.`,
  BANBALANCE_EMBED_DESCRIPTION: reason => `Reason: ${reason || "not provided"}`,
  SENDCOINS_COMMAND_DESCRIPTION: "sends an amount of ZetCoins to user",
  SENDCOINS_COMMAND_USAGE: "<user> <amount>",
  SENDCOINS_NO_ARGS_PROMPT: prefix => `> :x: What user you want to send ZetCoins to? Use \`${prefix}sendcoins <user> <amount>\``,
  SENDCOINS_NO_AMOUNT: "> :x: Please provide a valid amount of ZetCoins that you want to send.",
  SENDCOINS_AMOUNT_IS_NAN: "> :x: Provided amount is not a number.",
  SENDCOINS_CONFIRMATION_TITLE: (amount, user) => `Are you really want to send ${amount} ZetCoins to **${user.username}#${user.discriminator}**?`,
  SENDCOINS_CONFIRMATION_DESCRIPTION: "Type `yes`/`y` or `no`/`n`.\nYou have 30 seconds to agree.",
  SENDCOINS_SUCCESSFULLY_SENT: (amount, user) => `:white_check_mark: Successfully sent ${amount} ZetCoins to **${user.username + "#" + user.discriminator}**.`,
  SENDCOINS_CANCELLED_TRANSACTION: `:x: Transaction is cancelled by user.`,
  SENDCOINS_NOT_ENOUGH_MONEY: amount => `> :x: You don't have enough money. Your balance: ${amount} ZetCoins.`,
  SENDCOINS_TIME_EXPIRED: ":x: Time expired.",
  CANNOT_SEND_COINS_TO_SELF: "> :x: You can't send ZetCoins to self.",
  CANNOT_SEND_COINS_TO_BOT: "> :x: You can't send ZetCoins to bot.",
  SETBALANCE_COMMAND_DESCRIPTION: "sets the provided user's balance",
  SETBALANCE_COMMAND_USAGE: "<user> <amount>",
  SETBALANCE_NO_ARGS_PROMPT: prefix => `> Which user do you want to change the balance? Use ${prefix}setbalance <user> <amount>`,
  SETBALANCE_NO_AMOUNT: "> :x: Please provide an amount of ZetCoins you want to set.",
  SETBALANCE_AMOUNT_IS_NAN: "> :x: Provided amount is not a number.",
  SETBALANCE_EMBED_TITLE: user => `:white_check_mark: Successfully set the ${user.username + "#" + user.discriminator}'s balance.`,
  SETBALANCE_EMBED_DESCRIPTION: amount => `Now this user has ${amount} ZetCoins.`,
  TOP_COMMAND_DESCRIPTION: "top-10 of richest users in the server. You can use the -g or --global flag to see a global top.",
  TOP_TITLE: name => `Top of ${name}`,
  TOP_TITLE_GLOBAL: "Global top",
  TOP_BALANCE: balance => `<:zetcoins:766959525864669235> ${balance} ZetCoins.`,
  TOP_FOOTER: (position, balance) => `Your position in top is ${position}, and balance is ${balance} ZetCoins.`,
  UNBANBALANCE_COMMAND_DESCRIPTION: "unbans the provided user's balance",
  UNBANBALANCE_COMMAND_USAGE: "<user>",
  UNBANBALANCE_SUCCESSFUL_UNBAN: user => `> :white_check_mark: Successfully unbanned ${user.username + "#" + user.discriminator}'s balance.`,
  WORK_COMMAND_DESCRIPTION: "earn from 100 to 400 ZetCoins (1 time per hour)",
  WORK_COOLDOWN_TITLE: ":x: Not so fast!",
  WORK_COOLDOWN_DESC: time => `You can work again in **${time}** mins.`,
  WORK_EMBED_TITLE: "Work",
  WORK_EMBED_DESCRIPTION: (amount, balance) => `**You earned: ${amount}** ZetCoins <:zetcoins:766959525864669235>\n**Your balance: ${balance}** ZetCoins <:zetcoins:766959525864669235>`,
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
  DM_ANSWER_SENT: "Answer sent",
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
  AVATAR_DESCRIPTION: "gets your or someone's avatar. Keys can show the following:\n`-s` or `server` - server icon (if it has)\n`-sp` or `splash` - server splash (if it has)\n`-b` or `banner` - server banner (if it has)",
  AVATAR_USAGE: "[-s/server], [-sp/splash], [-b/banner] or [user]",
  AVATAR_USER: user => `Avatar of ${user.username}#${user.discriminator}`,
  SERVER_ICON: server => `Icon of ${server}`,
  SERVER_SPLASH: server => `Splash of ${server}`,
  SERVER_BANNER: server => `Banner of ${server}`,
  NO_ICON: "> :x: This server has no icon.",
  NO_SPLASH: "> :x: This server has no splash.",
  NO_BANNER: "> :x: This server has no banner.",
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
  SUPPORT_SUCCESS_DESC: "Please wait, it takes from 5 to 10 minutes",
  RESPOND_DESCRIPTION: "respond to question",
  RESPOND_USAGE: "<id> <answer>",
  RESPOND_NO_ARGS_PROMPT: prefix => `> :x: What question do you want to answer? Use \`${prefix} respond <id> <answer>\``,
  RESPOND_INVALID_ID: "> :x: Invalid ID.",
  RESPOND_SENT: "Your question has been answered",
  RESPOND_YOUR_QUESTION: "Your question",
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
  WHATIF_ANSWER: "Answer",
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
  INFO_DESCRIPTION: "information about bot",
  INFO_EMBED_DESC: "A multifunctional bot that simple in terms of economy written on JavaScript",
  INFO_DEVS: "Developers",
  INFO_LINKS: "Links",
  INFO_INVITE: "Add me to your server",
  INFO_SUPPORT_SERVER: "Support server",
  INFO_DONATE: "Donate",
  EMBED_DESCRIPTION: "sends the embed from JSON data. You can use [Discohook](https://discohook.org) or other embed generator to generate the embed",
  EMBED_USAGE: "<json>",
  EMBED_NO_ARGS: prefix => `> :x: What embed you want to send? Use \`${prefix}embed <json>\``,
  EMBED_PARSE_ERROR: ":x: An error occurred while parsing JSON:",
  EMBED_INVALID: "> :x: Invalid embed object.",
  KICK_DESCRIPTION: "kicks the provided user",
  KICK_USAGE: "<user> [reason]",
  KICK_NO_ARGS: prefix => `> :x: What user do you want to kick? Use \`${prefix}kick <user> [reason]\``,
  USER_NOT_FOUND: "> :x: User not found.",
  KICK_SUCCESS: user => `:white_check_mark: Successfully kicked ${user}`,
  REASON: reason => `Reason: ${reason || "none"}`,
  MEMBER_ROLE_HIGHER: "This member's role is higher than your role.",
  BOT_ROLE_HIGHER: "This member's role is higher than my role.",
  KICK_DONT_HAVE_PERMS: "I don't have the \"Kick Members\" permission to do this.",
  KICK_FAILED: ":x: Kick failed.",
  CANT_KICK_YOURSELF: "> :x: You can't kick yourself.",
  CANT_KICK_BOT: "> :x: You can't kick a bot.",
  BAN_DESCRIPTION: "bans the specified user",
  BAN_NO_ARGS: prefix => `> :x: What user do you want to ban? Use \`${prefix}ban <user> [reason]\``,
  BAN_SUCCESS: user => `:white_check_mark: Successfully banned ${user}`,
  BAN_DONT_HAVE_PERMS: "I don't have the \"Ban Members\" permission to do this.",
  BAN_FAILED: ":x: Ban failed.",
  CANT_BAN_YOURSELF: "> :x: You can't ban yourself.",
  CANT_BAN_BOT: "> :x: You can't ban a bot.",
  PURGE_DESCRIPTION: "deletes the specified amount of messages in a channel",
  PURGE_USAGE: "<amount>",
  PURGE_NO_ARGS: prefix => `> :x: What amount of messages you want to delete? Use \`${prefix}purge <amount>\``,
  AMOUNT_IS_NAN: "> :x: Amount is not a number.",
  PURGE_AMOUNT_LESS_THAN_1: "> :x: Amount must be not less than 1.",
  PURGE_AMOUNT_MORE_THAN_100: "> :x: Amount must be not more than 100.",
  PURGE_SUCCESS: amount => `:white_check_mark: Successfully deleted ${amount} messages.`,
  PURGE_EMBED_DESC: "This message will be deleted in 5 seconds.",
  SOFTBAN_DESCRIPTION: "softbans the specified user",
  SOFTBAN_NO_ARGS: prefix => `> :x: What user do you want to softban? Use \`${prefix}softban <user> [reason]\``,
  CANT_SOFTBAN_YOURSELF: "> :x: You can't softban yourself.",
  CANT_SOFTBAN_BOT: "> :x: You can't softban a bot.",
  SOFTBAN_SUCCESS: user => `:white_check_mark: Successfully softbanned ${user}`,
  SOFTBAN_FAILED: ":x: Softban failed.",
  REVERSE_DESCRIPTION: "reverses your text",
  REVERSE_USAGE: "<text>",
  REVERSE_NO_ARGS: prefix => `> :x: What do you want to reverse? Use \`${prefix}reverse <text>\``,
  REVERSE_TITLE: "Reverse",
  PREFIX_DESCRIPTION: "shows and changes the server prefix",
  PREFIX_USAGE: "[prefix]",
  PREFIX_DESC: prefix => `My prefix on this server is \`${prefix}\`\nType \`${prefix}help\` to get a list of commands`,
  PREFIX_FOOTER: prefix => `You can change the prefix by using ${prefix}prefix [prefix]`,
  PREFIX_TOO_LONG: "> :x: Prefix shouldn't be long than 10 characters.",
  PREFIX_SUCCESS: prefix => `> :white_check_mark: Prefix has been changed to \`${prefix}\``,
  DEVSAY_DESCRIPTION: "says your text as a bot",
  RATE_DESCRIPTION: "rate your chosen subject",
  RATE_USAGE: "<smth>",
  RATE_NO_ARGS: prefix => `> :x: What do you want to rate? Use \`${prefix}rate <smth>\``,
  RATE_EMBED_TITLE: "Rate", 
  RATE_ITEM: "Subject",
  RELOAD_DESCRIPTION: "reloads commands or languages",
  RELOAD_USAGE: "<cmdName> or langs or all",
  RELOAD_NO_ARGS: prefix => `> :x: What command you want to reload? Use \`${prefix}reload <cmdName> or langs or all\``,
  RELOAD_SUCCESS: cmd => `:white_check_mark: Command \`${cmd}\` successfully reloaded!`,
  RELOAD_ALL_SUCCESS: ":white_check_mark: All commands are successfully reloaded!",
  RELOAD_LANGS_SUCCESS: ":white_check_mark: Languages successfully reloaded!",
  RELOAD_COMMAND_DOESNT_EXIST: "> :x: This command doesn't exist.",
  RELOAD_ERROR: cmd => `:x: An error occurred while reloading command \`${name}\``,
  RELOAD_ERROR_ALL: ":x: An error occurred while reloading all commands",
  RELOAD_ERROR_LANGS: ":x: An error occurred while reloading languages",
  DEPOSIT_DESCRIPTION: "lets you to put or withdraw ZetCoins from deposit. Use this command without arguments to get more info",
  DEPOSIT_EMBED_TITLE: "Deposit help",
  DEPOSIT_EMBED_DESC: "You can put your ZetCoins to the deposit.\nHowever, you won't be able to use them, and this sum won't be counted in the top.\nEvery 2 hours 1% of the sum on deposit will be charged. Limit is 250000 ZetCoins.",
  DEPOSIT_USAGE: "How to use",
  DEPOSIT_USAGE_DESC: prefix => `\`${prefix}deposit put <sum>\n${prefix}deposit wd <sum>\``,
  DEPOSIT_INVALID_SUM: "> :x: Invalid sum.",
  DEPOSIT_NOT_ENOUGH_MONEY: bal => `> :x: You don't have enough ZetCoins. Your balance: ${bal} ZetCoins.`,
  DEPOSIT_PUT_SUCCESS: "Successfully put to deposit!",
  DEPOSIT_TOTAL: "Deposit",
  DEPOSIT_NOT_ENOUGH_DEPOSIT: bal => `> :x: You don't have enough ZetCoins on deposit. Your deposit balance: ${bal} ZetCoins.`,
  DEPOSIT_WD_SUCCESS: "Successfully withdrawn from deposit!",
  DEPOSIT_YOUR_BALANCE: "Your balance",
  RANDOM_DESCRIPTION: "Generates a random number in specified range.\nIf one number is provided, generates in range from 1 to number",
  RANDOM_USAGE: "<max> or <min> <max>",
  RANDOM_NO_ARGS: prefix => `> :x: What number do you want to generate? Use \`${prefix} random <max> or <min> <max>\``,
  RANDOM_NUMBER_IS_NAN: "> :x: Provided number is not a number.",
  RANDOM_TITLE: (max, min) => `Random number in range from ${min} to ${max}`,
  EMBEDCOLOR_DESCRIPTION: "Shows or changes your embed color",
  EMBEDCOLOR_USAGE: "[color: #hex or number | random | default]",
  EMBEDCOLOR_YOUR_COLOR: "Your embed color",
  EMBEDCOLOR_DEFAULT: "default",
  EMBEDCOLOR_FOOTER: prefix => `Use ${prefix}embedcolor [color: #hex or number | random | default] if you want to change the embed color`,
  EMBEDCOLOR_DEFAULT_SUCCESS: "> :white_check_mark: Your embed color has been changed to `default`.",
  EMBEDCOLOR_IS_NAN: "> :x: The color is not a number.",
  EMBEDCOLOR_SUCCESS: newColor => `> :white_check_mark: Your embed color has been changed to \`#${newColor}\``,
  EMBEDCOLOR_TOO_BIG: "> :x: Embed color can't be bigger than 16777216.",
  EMBEDCOLOR_RANDOM_SUCCESS: "> :white_check_mark: Your embed color has been changed to `random`.",
  EMBEDCOLOR_RANDOM: "random",
  WARN_DESCRIPTION: "Warns a member, also lets you to show user warns or delete them",
  WARN_USAGE: "[-d <id>] [-l [user]] <user> [reason]",
  WARN_NO_ARGS: prefix => `> :x: What user do you want to warn? Use \`${prefix}warn [-d <id>] [-l [user]] <user> [reason]\``,
  WARN_LIST: "Warn list",
  WARN_ITEM: id => `Warn ID ${id}`,
  WARN_TOTAL: total => `Total warns: ${total}`,
  WARN_DELETE_NO_ID: "> :x: Warn ID not specified.",
  WARN_INVALID_ID: "> :x: This warn does not exist or located on another server.",
  WARN_DELETE_SUCCESS: id => `> :white_check_mark: Warn with ID \`${id}\` deleted.`,
  CANT_WARN_YOURSELF: "> :x: You can't warn yourself.",
  CANT_WARN_BOTS: "> :x: You can't warn a bot.",
  WARN_SUCCESS: user => `:white_check_mark: ${user} has been warned`,
  WARN_ID: id => `Warn ID: ${id}`,
  WARN_FAILED: ":x: Warn failed",
  WARN_FAILED_REASON: "This user's role is higher than your.",
  ROLE_DESCRIPTION: "Shows info about role",
  ROLE_USAGE: "<role>",
  ROLE_CREATED_AT: "Created at",
  ROLE_NOT_FOUND: "> :x: Role not found.",
  ROLE_MEMBERS: "Members with this role",
  ROLE_MENTIONABLE: "Mentionable?",
  ROLE_HOISTED: "Hoisted?",
  ROLE_MANAGED: "Managed by integration?",
  YES_NO: what => what ? "Yes" : "No",
  ROLE_COLOR: "Color",
  ROLE_COLOR_DEFAULT: "Default",
  DEMOTIVATOR_DESCRIPTION: "Creates a demotivator.\n-w key makes the demotivator white.\nYou can use double quotes for text and bottom text",
  DEMOTIVATOR_USAGE: "[-w] <text> <bottom text> <image: url or attachment>",
  DEMOTIVATOR_NO_BOTTOM_TEXT: "> :x: Provide the bottom text.",
  DEMOTIVATOR_NO_IMAGE: "> :x: Provide the image.",
};
