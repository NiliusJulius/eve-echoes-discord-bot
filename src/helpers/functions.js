const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

/* istanbul ignore next */
function readCommands(client) {
  client.commands = new Discord.Collection();
  // Read all command files.
  const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands/')).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name.toLowerCase(), command);
  }
}
exports.readCommands = readCommands;

function getUserFromMention(mention, client) {
  // The id is the first and only match found by the RegEx.
  const matches = mention.match(/^<@!?(\d+)>$/);

  // If supplied variable was not a mention, matches will be null instead of an array.
  if (!matches) return;

  // However the first element in the matches array will be the entire mention, not just the ID,
  // so use index 1.
  const id = matches[1];

  return client.users.cache.get(id);
}
exports.getUserFromMention = getUserFromMention;