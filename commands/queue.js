const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("@discordjs/js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue."),
    execute: async ({client,interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue || !queue.playing) {
            await interaction.reply("There is no song playing, idiot.");
            return;
        }

        const queueString = queue.tracks.slice(0, 10).map((song,i) => {
            return `${i+1})  [${son.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`** Currently Playing:**\n\` ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)  
            ]
        })
    }
}