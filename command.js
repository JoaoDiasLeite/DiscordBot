require('dotenv').config();

const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'yt',
    description: 'Plays song from YouTube!',
  },
  {
    name: 'sc',
    description: 'Plays song from SoundCloud!',
  },
  {
    name: 'sp',
    description: 'Plays song from Spotify!',
  },
  {
    name: 'gabriel',
    description: 'é Gay!',
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands('1035718372408688690'), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();