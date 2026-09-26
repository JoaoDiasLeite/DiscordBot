const { SlashCommandBuilder } = require("discord.js")
const { SpotifyExtractor } = require("@discord-player/extractor")
const { playQuery } = require("../utils/play")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sp")
		.setDescription("Plays a song from Spotify")
		.addStringOption((option) =>
			option.setName("query").setDescription("A Spotify url or search keywords").setRequired(true)
		),
	run: async ({ client, interaction }) => {
		// Spotify only answers with API credentials; audio is then streamed from YouTube
		if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
			return interaction.editReply("Spotify isn't set up on this bot yet")
		}

		await playQuery(client, interaction, {
			query: interaction.options.getString("query"),
			searchEngine: `ext:${SpotifyExtractor.identifier}`,
		})
	},
}
