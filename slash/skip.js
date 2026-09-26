const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { getControllableQueue } = require("../utils/queue")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async ({ client, interaction }) => {
		const queue = await getControllableQueue(client, interaction)
		if (!queue) return

		const currentSong = queue.currentTrack

		queue.node.skip()
		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setDescription(`${currentSong.title} has been skipped!`)
					.setThumbnail(currentSong.thumbnail || null),
			],
		})
	},
}
