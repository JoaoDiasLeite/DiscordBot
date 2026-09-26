const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { getQueue } = require("../utils/queue")

const PAGE_SIZE = 10

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Displays the current song queue")
		.addIntegerOption((option) => option.setName("page").setDescription("Page number of the queue").setMinValue(1)),

	run: async ({ client, interaction }) => {
		const queue = await getQueue(client, interaction)
		if (!queue) return

		const tracks = queue.tracks.toArray()
		const totalPages = Math.ceil(tracks.length / PAGE_SIZE) || 1
		const page = (interaction.options.getInteger("page") ?? 1) - 1

		if (page + 1 > totalPages)
			return interaction.editReply(`Invalid Page. There are only a total of ${totalPages} pages of songs`)

		const queueString =
			tracks
				.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
				.map((song, i) => `**${page * PAGE_SIZE + i + 1}.** \`[${song.duration}]\` ${song.title} -- ${song.requestedBy ?? "unknown"}`)
				.join("\n") || "Nothing else queued"

		const currentSong = queue.currentTrack

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setDescription(
						`**Currently Playing**\n` +
							`\`[${currentSong.duration}]\` ${currentSong.title} -- ${currentSong.requestedBy ?? "unknown"}` +
							`\n\n**Queue**\n${queueString}`
					)
					.setFooter({ text: `Page ${page + 1} of ${totalPages}` })
					.setThumbnail(currentSong.thumbnail || null),
			],
		})
	},
}
