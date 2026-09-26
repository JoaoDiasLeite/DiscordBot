const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
	run: async ({ client, interaction }) => {
		const reply = await interaction.fetchReply()
		const roundTrip = reply.createdTimestamp - interaction.createdTimestamp
		await interaction.editReply(`Pong! 🏓 ${roundTrip}ms (websocket ${client.ws.ping}ms)`)
	},
}
