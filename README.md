# xkcd bot

A simple bot for searching xkcd comics.

[Invite the bot!](https://discord.com/api/oauth2/authorize?client_id=884864200374124624&scope=applications.commands)

### Setup

(generated from [Dougley's repo](https://github.com/Dougley/discord-interactions-worker)).

1. Make an application on [Discord's developer portal](https://discord.com/developers/applications)
2. Copy the public key as shown on the application page, and paste it in `index.js` under `const DISCORD_NACL_PUBLIC_KEY`
3. If you haven't already, install [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update)
4. Run `npm install`
5. [Login to Cloudflare](https://developers.cloudflare.com/workers/cli-wrangler/authentication), and set assosiated variables in `wrangler.toml`
6. Run `wrangler publish` once you're ready to upload your worker to Cloudflare
