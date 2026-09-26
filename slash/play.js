const { SlashCommandBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { YoutubeExtractor } = require("discord-player-youtubei")
const { playQuery } = require("../utils/play")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Loads songs from YouTube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Loads a single song from a url")
				.addStringOption((option) => option.setName("url").setDescription("The song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Loads a playlist of songs from a url")
				.addStringOption((option) => option.setName("url").setDescription("The playlist's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song based on provided keywords")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("The search keywords").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		const subcommand = interaction.options.getSubcommand()

		if (subcommand === "search") {
			return playQuery(client, interaction, {
				query: interaction.options.getString("searchterms"),
				searchEngine: `ext:${YoutubeExtractor.identifier}`,
			})
		}

		await playQuery(client, interaction, {
			query: interaction.options.getString("url"),
			searchEngine: QueryType.AUTO,
			playlist: subcommand === "playlist",
		})
	},
}
