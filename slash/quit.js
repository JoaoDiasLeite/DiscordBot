const { SlashCommandBuilder } = require("discord.js")
const { getControllableQueue } = require("../utils/queue")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("Stops the bot and clears the queue"),
	run: async ({ client, interaction }) => {
		const queue = await getControllableQueue(client, interaction)
		if (!queue) return

		queue.delete()
		await interaction.editReply("Bye!")
	},
}
