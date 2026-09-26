const { EmbedBuilder } = require("discord.js")

// Searches, joins the member's voice channel and queues the result, then
// answers the (already deferred) interaction. `searchEngine` picks the source;
// with `playlist: true` the whole playlist is queued instead of the first match.
async function playQuery(client, interaction, { query, searchEngine, playlist = false }) {
	const channel = interaction.member.voice.channel
	if (!channel) return interaction.editReply("You need to be in a VC to use this command")

	const existingQueue = client.player.nodes.get(interaction.guildId)
	if (existingQueue?.channel && existingQueue.channel.id !== channel.id) {
		return interaction.editReply(`I'm already playing in ${existingQueue.channel}`)
	}

	// Search before joining the channel so the bot doesn't sit in VC with nothing to play
	const result = await client.player.search(query, { requestedBy: interaction.user, searchEngine })

	if (!result.hasTracks()) return interaction.editReply("No results")
	if (playlist && !result.playlist) return interaction.editReply("That url is not a playlist")

	const toPlay = playlist ? result : result.tracks[0]

	await client.player.play(channel, toPlay, {
		nodeOptions: {
			metadata: { channel: interaction.channel },
			selfDeaf: true,
			leaveOnEnd: true,
			leaveOnEndCooldown: 60_000,
			leaveOnEmpty: true,
			leaveOnEmptyCooldown: 60_000,
		},
	})

	const embed = new EmbedBuilder()
	if (playlist) {
		embed
			.setDescription(
				`**${result.tracks.length} songs from [${result.playlist.title}](${result.playlist.url})** have been added to the Queue`
			)
			.setThumbnail(result.playlist.thumbnail || null)
	} else {
		embed
			.setDescription(`**[${toPlay.title}](${toPlay.url})** has been added to the Queue`)
			.setThumbnail(toPlay.thumbnail || null)
			.setFooter({ text: `Duration: ${toPlay.duration}` })
	}

	await interaction.editReply({ embeds: [embed] })
}

module.exports = { playQuery }
