const { SlashCommandBuilder } = require("discord.js")
const { getControllableQueue } = require("../utils/queue")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skipto")
		.setDescription("Skips to a certain track #")
		.addIntegerOption((option) =>
			option.setName("tracknumber").setDescription("The track to skip to").setMinValue(1).setRequired(true)
		),
	run: async ({ client, interaction }) => {
		const queue = await getControllableQueue(client, interaction)
		if (!queue) return

		const trackNum = interaction.options.getInteger("tracknumber")
		if (trackNum > queue.tracks.size) return interaction.editReply("Invalid track number")

		queue.node.skipTo(trackNum - 1)
		await interaction.editReply(`Skipped ahead to track number ${trackNum}`)
	},
}
