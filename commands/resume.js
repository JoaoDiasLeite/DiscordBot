const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("@discordjs/js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song."),
    execute: async ({client,interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("There is no song playing, u cunt!");
            return;
        }

        queue.setPaused(false);

        await interaction.reply("Resumed playing, cause im a slave.");
    }
}