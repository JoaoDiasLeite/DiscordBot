require("dotenv").config()
const { Client, Collection, GatewayIntentBits, MessageFlags } = require("discord.js")
const { Player } = require("discord-player")
const { DefaultExtractors, SpotifyExtractor } = require("@discord-player/extractor")
const { YoutubeExtractor } = require("discord-player-youtubei")
const { loadCommands } = require("./utils/commands")

const { TOKEN } = process.env

if (!TOKEN) {
	console.error("TOKEN must be set in .env")
	process.exit(1)
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

client.slashcommands = new Collection()
for (const cmd of loadCommands()) client.slashcommands.set(cmd.data.name, cmd)

client.player = new Player(client)

client.player.events.on("playerStart", (queue, track) => {
	queue.metadata?.channel?.send(`Now playing **${track.title}**`).catch(() => {})
})
client.player.events.on("error", (queue, error) => {
	console.error(`[${queue.guild.name}] Queue error:`, error)
})
client.player.events.on("playerError", (queue, error, track) => {
	console.error(`[${queue.guild.name}] Could not play ${track.title}:`, error)
	queue.metadata?.channel?.send(`Could not play **${track.title}**, skipping it`).catch(() => {})
})

client.once("clientReady", () => {
	console.log(`Logged in as ${client.user.tag}`)
})

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const slashcmd = client.slashcommands.get(interaction.commandName)
	if (!slashcmd) {
		return interaction.reply({ content: "Not a valid slash command", flags: MessageFlags.Ephemeral })
	}

	try {
		await interaction.deferReply()
		await slashcmd.run({ client, interaction })
	} catch (err) {
		console.error(`Error running /${interaction.commandName}:`, err)
		const message = "Something went wrong while running this command"
		if (interaction.deferred || interaction.replied) {
			await interaction.editReply({ content: message, embeds: [] }).catch(() => {})
		} else {
			await interaction.reply({ content: message, flags: MessageFlags.Ephemeral }).catch(() => {})
		}
	}
})

// Hosts that run the bot as a web service (e.g. Koyeb) health-check this port
if (process.env.PORT) {
	require("http")
		.createServer((req, res) => res.end(client.isReady() ? "ok" : "starting"))
		.listen(process.env.PORT, () => console.log(`Health check listening on port ${process.env.PORT}`))
}

async function main() {
	await client.player.extractors.register(YoutubeExtractor, {})
	await client.player.extractors.loadMulti(DefaultExtractors, {
		[SpotifyExtractor.identifier]: {
			clientId: process.env.SPOTIFY_CLIENT_ID || null,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET || null,
		},
	})
	await client.login(TOKEN)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
