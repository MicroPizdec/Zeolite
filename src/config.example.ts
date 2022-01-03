export default {
  token: "put your bot token here",
  owners: [ "put your user id here" ],
  dbUri: "sqlite:bot.db", // or use another
  webhookUrl: "put your cmd logs webhook url here",
  lavalinkNodes: [ { host: "localhost", port: 2333, password: "youshallnotpass" } ], // needed for music
}