const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("@discordjs/js");
const { QueryType} = require("discord-player");

//play search <song>

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addSubcommand(subcommand => 
            subcommand
                .setName("search")
                .setDescription("Searches for song.")
                .addStringOption(option => 
                    option  
                        .setName("searchterms")
                        .setDescription("search keywords")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("playlist")
                .setDescription("Plays playlist from YT.")
                .addStringOption(option => 
                    option  
                        .setName("url")
                        .setDescription("playlist url")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("Song")
                .setDescription("Plays song from YT")
                .addStringOption(option => 
                    option  
                        .setName("url")
                        .setDescription("url of the song")
                        .setRequired(true)
                )
        ),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel)
        {
            await interaction.reply("You must be in a voice channel to use this command stuupid.");
            return;
        }

        const queue = await client.player.createQueue(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed();
        if(interaction.options.getSubcommand() === "song")
        {
            let url = interaction.options.getSring("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if (result.tracks.length ===0)
            {
                await interaction.reply("no results found");
                return
            }

            const song =result.tracks[0]  
            await queue.addTrack(song); 

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});

        }
        else if(interaction.options.getSubcommand() === "playlist")
        {
            let url = interaction.options.getSring("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if (result.tracks.length ===0)
            {
                await interaction.reply("no playlist found");
                return
            }

            const playlist =result.playlist 
            await queue.addTracks(playlist); 

            embed
                .setDescription(`Added **[${playlist.title}](${playlist.url})** to queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Duration: ${playlist.duration}`});
                
        }
        else if(interaction.options.getSubcommand() === "search")
        {
            let url = interaction.options.getSring("searchterms");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (result.tracks.length ===0)
            {
                await interaction.reply("no results found");
                return
            }

            const song =result.tracks[0] 
            await queue.addTracks(song); 

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
                
        }

        if(!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })
    }
}       