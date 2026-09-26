# Bot Fernandes

A Discord music bot that plays audio from YouTube (and SoundCloud, Spotify links, etc.) in voice channels, built with [discord.js](https://discord.js.org/) and [discord-player](https://discord-player.js.org/).

## Commands

| Command | Description |
|---|---|
| `/play song <url>` | Adds a single song from a url |
| `/play playlist <url>` | Adds every song from a playlist url |
| `/play search <searchterms>` | Searches YouTube and adds the first result |
| `/info` | Shows the current song with a progress bar |
| `/queue [page]` | Lists the queue, 10 songs per page |
| `/pause` / `/resume` | Pauses or resumes playback |
| `/skip` | Skips the current song |
| `/skipto <tracknumber>` | Jumps to a position in the queue |
| `/shuffle` | Shuffles the queue |
| `/quit` | Clears the queue and leaves the voice channel |

Commands that control playback only work when you are in the same voice channel as the bot. The bot leaves on its own one minute after the queue ends or the channel empties.

## Setup

Requires Node.js 20 or newer.

1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications), add a bot, and copy its token and the application ID.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in `TOKEN` and `CLIENT_ID`. Set `GUILD_ID` to register commands on a single server instantly; leave it empty to register them globally.
4. Register the slash commands (again whenever a command's options change):
   ```sh
   npm run deploy
   ```
5. Start the bot:
   ```sh
   npm start
   ```
   Use `npm run dev` to restart automatically on file changes.

Invite the bot with the `bot` and `applications.commands` scopes and the Connect and Speak permissions.

## Project layout

- `index.js` — starts the client and the player, and routes slash commands
- `deploy-commands.js` — registers the slash commands with Discord
- `slash/` — one file per command
- `utils/` — command loading and shared queue checks

## License

Distributed under the MIT License. See `LICENSE` for more information.
