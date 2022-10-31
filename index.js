require('./command.js');
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
  if (interaction.commandName === 'gabriel') {
    await interaction.reply('é Gay!');
  }
  if (interaction.commandName === 'yt') {
    await interaction.reply('é Gay!');
  }
});

client.login(process.env.TOKEN);

