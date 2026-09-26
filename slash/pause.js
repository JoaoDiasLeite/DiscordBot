const { SlashCommandBuilder } = require("discord.js")
const { getControllableQueue } = require("../utils/queue")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
	run: async ({ client, interaction }) => {
		const queue = await getControllableQueue(client, interaction)
		if (!queue) return

		if (queue.node.isPaused()) return interaction.editReply("The music is already paused")

		queue.node.pause()
		await interaction.editReply("Music has been paused! Use `/resume` to resume the music")
	},
}
