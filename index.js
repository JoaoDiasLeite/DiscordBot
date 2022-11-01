require('dotenv').config();

var token = process.env.TOKEN

console.log(token.toString());

const {REST} = require('@discordjs/rest');
const { Routes } = require('discord- api-types/v9');
const { Client, Intents, Collection } = require('discord.js');

const fs = require('fs');
const path = require('path');


const client = new Client({
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS_GUILD_MESSAGES]
});

