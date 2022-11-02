const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("@discordjs/js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exits the Voice channel."),
    execute: async ({client,interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("There is no song playing, u cunt!");
            return;
        }

        queue.destroy();

        await interaction.reply("Why? Is it because im black?")
    }
}
