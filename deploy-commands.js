// Registers the slash commands with Discord. Run with `npm run deploy`.
// With GUILD_ID set, commands are registered on that server only and show up
// instantly; without it they are registered globally, which can take up to an hour.
require("dotenv").config()
const { REST, Routes } = require("discord.js")
const { loadCommands } = require("./utils/commands")

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

if (!TOKEN || !CLIENT_ID) {
	console.error("TOKEN and CLIENT_ID must be set in .env")
	process.exit(1)
}

const commands = loadCommands().map((cmd) => cmd.data.toJSON())
const route = GUILD_ID ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID) : Routes.applicationCommands(CLIENT_ID)

new REST()
	.setToken(TOKEN)
	.put(route, { body: commands })
	.then(() => {
		console.log(`Deployed ${commands.length} slash commands ${GUILD_ID ? `to guild ${GUILD_ID}` : "globally"}`)
	})
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
