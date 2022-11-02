require('dotenv').config();

var token = process.env.TOKEN
var client_id = process.env.CLIENT_ID


console.log(token.toString());

const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require('discord.js');
const { PLayer, Player } = require("discord-player");

const fs = require('fs');
const path = require('path');


const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS_GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

//load all the commands
const commands =[];
client.commands =new Collection();

const commandsPath =path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandsFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.date.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestudio",
        highWaterMArk: 1 << 25
    }
});

client.on("ready",() => {
    const guild_ids =client.guilds.cache.map(guild => guild.id);

    const rest = new Rest({version: "9"}).setToken(process.env.TOKEN);
    for (const guildId of guild_ids)
    {
        rest.put(ROutes.applicationGuildCommands(process.env.CLIENT_ID, guildId),{
            body: commands
        })
        .then(() => console.log(`Added commands to ${guildId}`))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(err)
    {
        console.error(err);
        await interaction.reply("An error occurred while executing that command.");
    }
})

client.login(process.env.TOKEN);