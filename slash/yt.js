const { SlashCommandBuilder } = require("discord.js")
const { YoutubeExtractor } = require("discord-player-youtubei")
const { playQuery } = require("../utils/play")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("yt")
		.setDescription("Plays a song from YouTube")
		.addStringOption((option) =>
			option.setName("query").setDescription("A YouTube url or search keywords").setRequired(true)
		),
	run: async ({ client, interaction }) => {
		await playQuery(client, interaction, {
			query: interaction.options.getString("query"),
			searchEngine: `ext:${YoutubeExtractor.identifier}`,
		})
	},
}
