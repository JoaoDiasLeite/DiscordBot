const { SlashCommandBuilder } = require("discord.js")
const { getControllableQueue } = require("../utils/queue")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
	run: async ({ client, interaction }) => {
		const queue = await getControllableQueue(client, interaction)
		if (!queue) return

		if (!queue.node.isPaused()) return interaction.editReply("The music is not paused")

		queue.node.resume()
		await interaction.editReply("Music has been resumed! Use `/pause` to pause the music")
	},
}
