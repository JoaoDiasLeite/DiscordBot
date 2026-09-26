const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { getQueue } = require("../utils/queue")

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("Displays info about the currently playing song"),
	run: async ({ client, interaction }) => {
		const queue = await getQueue(client, interaction)
		if (!queue) return

		const song = queue.currentTrack
		const bar = queue.node.createProgressBar({ queue: false, length: 19 }) ?? ""

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setThumbnail(song.thumbnail || null)
					.setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar),
			],
		})
	},
}
