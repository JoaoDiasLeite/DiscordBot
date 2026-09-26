const { SlashCommandBuilder } = require("discord.js")
const { SoundCloudExtractor } = require("@discord-player/extractor")
const { playQuery } = require("../utils/play")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sc")
		.setDescription("Plays a song from SoundCloud")
		.addStringOption((option) =>
			option.setName("query").setDescription("A SoundCloud url or search keywords").setRequired(true)
		),
	run: async ({ client, interaction }) => {
		await playQuery(client, interaction, {
			query: interaction.options.getString("query"),
			searchEngine: `ext:${SoundCloudExtractor.identifier}`,
		})
	},
}
