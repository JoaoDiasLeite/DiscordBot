const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("gabriel").setDescription("Gabriel"),
	run: async ({ interaction }) => {
		await interaction.editReply("é Gay!")
	},
}