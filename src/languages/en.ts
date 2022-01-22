export default {
  langName: "en",
  testString: "Test string",
  notBotOwner: "> :x: You aren't the bot owner!",
  guildOnlyCommand: "> :x: You can't use this command in PM!",
  noPermissions: "> :x: You don't have permissions to use this command. Required permissions: `%s`",
  commandError: ":x: An error occurred while running the command.",
  commandErrorDesc: "This error was sent to the bot developers and will be fixed as soon as possible.",
  cooldown: "> :warning: You can use this command after %d seconds.",

  avatarTitle: "Avatar of %s",
  avatarURL: "Avatar URL",
  avatarNoServerIcon: "> :x: The server does not have an icon.",
  avatarServerIcon: "Server icon",
  avatarIconURL: "Icon URL",
  avatarNoBanner: "> :x: The server does not have a banner.",
  avatarBanner: "Server banner",
  avatarBannerURL: "Banner URL",

  stats: "Stats",
  statsUptime: "Uptime",
  statsRamUsed: "RAM used",
  statsPing: "Ping",
  statsServers: "Servers",
  statsUsers: "Users",
  statsChannels: "Channels",
  statsCpu: "CPU",

  userBadges: "Badges",
  userBadgesNone: "None",
  userFooter: `ID: %s\nRegistered %d days ago`,
  userJoinDate: "Join date",
  userRoles: "Roles",

  infoTitle: "About bot",
  infoDesc: "**Let your journey begin.**\nA multipurpose bot that simple in terms of economy, moderation, and more, written on TypeScript with discord.js library.",
  infoLinks: "Links",
  infoInvite: "Add me to your server",
  infoSupportServer: "Support server",
  infoRepository: "GitHub repository",
  infoDonate: "Donate",
  infoDevs: "Developers",

  serverOwner: "Owner",
  serverVerificationLevel: "Verification level",
  serverChannels: "Channels",
  serverChannelsDesc: "text - %d\nvoice - %d",
  serverMembers: "Members",
  serverEmojis: "Emojis",
  serverEmojisDesc: "static - %d\nanimated - %d",
  serverRolesCount: "Roles count",
  serverFooter: "ID: %s\nCreated %d days ago",

  demotivatorInvalidURL: "> :x: Invalid image URL provided.",
  demotivatorCreator: "Created by %s",

  embedInvalidJSON: "> :x: Invalid JSON string provided.",

  npmPackageNotFound: "> :x: Package not found.",
  npmVersion: "Version",
  npmModifiedAt: "Modified at",
  npmLicense: "License",
  npmKeywords: "Keywords",

  urbanSomethingWentWrong: "> :x: Something went wrong.",
  urbanWordNotFound: "> :x: Word not found.",
  urbanCantShowDefinition: "> :x: I can't show the definition here, but there is a link for this [definiton](%s)",
  urbanExample: "Example",
  urbanRating: "Rating",
  urbanAuthor: "Author: %s",

  langAvailableLanguages: "Available languages",
  langYourLanguage: "Your language",
  langInvalid: "> :x: Invalid language provided.",
  langSuccess: "> :white_check_mark: Your language has been changed to `%s`",

  embedcolorYourColor: "Your embed color",
  embedcolorRandom: "random",
  embedcolorDefault: "default",
  embedcolorNoOptions: "> :warning: No options provided.",
  embedcolorOnlyOneOption: "> :warning: You can provide only one option.",
  embedcolorIsNaN: "> :x: Provided color is not a number.",
  embedcolorTooBig: "> :x: Provided color is bigger than 16777216.",
  embedcolorSuccess: "> :white_check_mark: Set the embed color to `#%s`.",
  embedcolorRandomSuccess: "> :white_check_mark: Set the embed color to `random`.",
  embedcolorResetSuccess: "> :white_check_mark: Reset the embed color to default.",

  colorNumber: "Number",

  payCantSendToYourself: "> :x: You can't send money to self.",
  payCantSendToBot: "> :x: You can't send money to bot.",
  payInvalidAmount: "> :x: Money amount is less than or equal to 0.",
  payInsufficientFunds: "> :x: You have insufficient funds. Your balance: %d %s.",
  payConfirmationTitle: "Are you really want to send %d %s to **%s**?", 
  payConfirmationDesc: "You have 5 minutes to agree.",
  payYes: "Yes",
  payNo: "No",
  payTimeExpired: ":x: Time expired.",
  paySuccessfullySent: ":white_check_mark: Sent %d %s to **%s**.",
  payCancelled: ":x: Transaction is cancelled by user",

  workCooldownTitle: ":timer: Not so fast!",
  workCooldown: "You can work again <t:%d:R>.",
  workDisabled: "> :x: Work is disabled by administrator.",
  workDesc: "You earned **%d** %s\nYour balance: **%d** %s",

  diceDisabled: "> :x: Dice is disabled by administrator.",
  diceWin: "Win!",
  diceWinDesc: "You won **%d** %s\nYour balance: **%d** %s",
  diceLoss: "Loss",
  diceLossDesc: "You lost **%d** %s\nYour balance: **%d** %s",

  invalidEmoji: "> :x: Invalid emoji provided.",
  setcurrencySuccess: "> :white_check_mark: Successfully changed the currency icon to %s.",
  setcurrencyResetSuccess: "> :white_check_mark: Successfully reset the currency icon to default.",

  roleCreatedAt: "Created at",
  roleHoisted: "Hoisted?",
  roleManaged: "Managed by application?",
  roleColor: "Color",
  roleColorDefault: "default",
  daysAgo: "(%d days ago)",

  topTitle: "Top-10 of richest members in %s",
  topEmpty: "Empty",
  topFooter: "Your position is %d, and your balance is %d.",

  depositInfo: "Deposit info",
  depositInfoDesc: "You can put your money to the deposit.\nHowever, you won't be able to use them, and this sum won't be counted in the top.\nEvery 4 hours 1% of the sum on deposit will be charged. Limit is 250000 %s.",
  depositPutDesc: "Successfully put %d %s to the deposit!\nYour balance: %d %s\nYour deposit: %d %s",
  depositInsufficientFunds: "> :x: You have insufficient funds on your deposit. Your deposit: %d %s",
  depositWithdrawDesc: "Successfully withdrew %d %s from deposit!\nYour balance: %d %s\nYour deposit: %d %s",
  balanceDeposit: "Deposit",
}