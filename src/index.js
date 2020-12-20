const Discord = require('discord.js');
const { token } = require('./config.json');
const { handleOnceReady, handleOnMessage } = require('./eventHandlers/clientEventHandler');
const { readCommands } = require('./helpers/functions');

const client = new Discord.Client();
const cooldowns = new Discord.Collection();

readCommands(client);

// Bot startup.
client.once('ready', () => {
  handleOnceReady();
});

// Listen for commands.
client.on('message', message => {
  handleOnMessage(message, client, cooldowns);
});

client.login(token);