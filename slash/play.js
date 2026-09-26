const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { YoutubeExtractor } = require("discord-player-youtubei")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Loads songs from YouTube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Loads a single song from a url")
				.addStringOption((option) => option.setName("url").setDescription("The song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Loads a playlist of songs from a url")
				.addStringOption((option) => option.setName("url").setDescription("The playlist's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song based on provided keywords")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("The search keywords").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		const channel = interaction.member.voice.channel
		if (!channel) return interaction.editReply("You need to be in a VC to use this command")

		const existingQueue = client.player.nodes.get(interaction.guildId)
		if (existingQueue?.channel && existingQueue.channel.id !== channel.id) {
			return interaction.editReply(`I'm already playing in ${existingQueue.channel}`)
		}

		const subcommand = interaction.options.getSubcommand()
		const query =
			subcommand === "search" ? interaction.options.getString("searchterms") : interaction.options.getString("url")

		// Search before joining the channel so the bot doesn't sit in VC with nothing to play
		const result = await client.player.search(query, {
			requestedBy: interaction.user,
			searchEngine: subcommand === "search" ? `ext:${YoutubeExtractor.identifier}` : QueryType.AUTO,
		})

		if (!result.hasTracks()) return interaction.editReply("No results")
		if (subcommand === "playlist" && !result.playlist) return interaction.editReply("That url is not a playlist")

		// For a single song or a search, only queue the first match
		const toPlay = subcommand === "playlist" ? result : result.tracks[0]

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
		if (subcommand === "playlist") {
			const playlist = result.playlist
			embed
				.setDescription(
					`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`
				)
				.setThumbnail(playlist.thumbnail || null)
		} else {
			const song = toPlay
			embed
				.setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
				.setThumbnail(song.thumbnail || null)
				.setFooter({ text: `Duration: ${song.duration}` })
		}

		await interaction.editReply({ embeds: [embed] })
	},
}
