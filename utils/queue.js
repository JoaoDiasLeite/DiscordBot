// Shared guards for the music commands. Every command is deferred before it
// runs, so these answer with editReply and return null when the check fails.

async function getQueue(client, interaction) {
	const queue = client.player.nodes.get(interaction.guildId)

	if (!queue || !queue.currentTrack) {
		await interaction.editReply("There are no songs in the queue")
		return null
	}

	return queue
}

async function getControllableQueue(client, interaction) {
	const queue = await getQueue(client, interaction)
	if (!queue) return null

	if (interaction.member.voice.channelId !== queue.channel?.id) {
		await interaction.editReply("You need to be in the same voice channel as the bot to use this command")
		return null
	}

	return queue
}

module.exports = { getQueue, getControllableQueue }
