const { SlashCommandBuilder } = require("discord.js")
const quit = require("./quit")

module.exports = {
	data: new SlashCommandBuilder().setName("exit").setDescription("Exits the voice channel and clears the queue"),
	run: quit.run,
}
