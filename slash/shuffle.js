const { SlashCommandBuilder } = require("discord.js")
const { getControllableQueue } = require("../utils/queue")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ client, interaction }) => {
		const queue = await getControllableQueue(client, interaction)
		if (!queue) return

		if (queue.tracks.size < 2) return interaction.editReply("There aren't enough songs in the queue to shuffle")

		queue.tracks.shuffle()
		await interaction.editReply(`The queue of ${queue.tracks.size} songs has been shuffled!`)
	},
}
