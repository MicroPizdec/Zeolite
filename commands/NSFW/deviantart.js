const fetch = require("node-fetch");

let token, isTokenExpired = true;

async function getToken() {
  return fetch(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${config.deviantart.clientID}&client_secret=${config.deviantart.clientSecret}`)
    .then(r => r.json());
}

module.exports = {
  name: "deviantart",
  group: "NSFW_GROUP",
  description: "DEVIANTART_DESCRIPTION",
  usage: "DEVIANTART_USAGE",
  argsRequired: true,
  aliases: [ "da" ],
  async run(client, msg, args, prefix, lang) {
    if (!msg.channel.nsfw) {
      return msg.reply(msg.t("NOT_NSFW_CHANNEL", this.name));
    }

    if (isTokenExpired) {
      const tokenData = await getToken();

      token = tokenData.access_token;
      isTokenExpired = false;
      setTimeout(() => isTokenExpired = true, tokenData.expires_in * 1000);
    }

    const tag = args.join(" ");

    const data = await fetch(`https://www.deviantart.com/api/v1/oauth2/browse/tags?tag=${encodeURI(tag)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json());

    if (!data?.results?.length) {
      return msg.reply(msg.t("DEVIANTART_NOT_FOUND"));
    }

    const result = data.results[Math.floor(Math.random() * data.results.length)];

    const embed = {
      author: {
        name: result.author.username,
        icon_url: result.author.usericon,
      },
      title: result.title,
      url: result.url,
      color: await msg.author.embedColor(),
      image: { url: result.preview.src },
      fields: [
        {
          name: msg.t("DEVIANTART_FAVOURITES"),
          value: result.stats.favourites,
          inline: true,
        },
        {
          name: msg.t("DEVIANTART_COMMENTS"),
          value: result.stats.comments,
          inline: true,
        },
      ],
    };

    await msg.reply({ embed });
  }
}