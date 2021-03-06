const Discord = require('discord.js');
const { getMessage } = require('../caches/languageCache');
const { botName, prefix } = require('../config.json');
const { cooldown } = require('../helpers/constants');

function handleOnceReady() {
  console.log(`${botName} is online!`);
}
exports.handleOnceReady = handleOnceReady;

function handleOnMessage(message, client, cooldowns) {
  // If the message doesn't start with the prefix, or it is send by a bot, exit.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Read the command name and arguments.
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Retrieve the correct command.
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // If the command is not known, exit.
  if (!command) return;

  // Server only commands in DMs.
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply(getMessage('clientEventHandler.cannotExecuteInDMs'));
  }

  // If the command requires arguments but did not receive any, or did not receive the correct amount of arguments.
  if (command.args && (!args.length || (command.argsLength && args.length != command.argsLength))) {
    let reply = getMessage('clientEventHandler.incorrectArguments', undefined, [message.author]);

    if (command.usage) {
      reply += getMessage('clientEventHandler.properUsage', undefined, [prefix, command.name, command.usage]);
    }

    return message.channel.send(reply);
  }

  // Grab the command cooldown information.
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || cooldown) * 1000;

  // If there is a cooldown on this command from the person trying to call it, return a message.
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(getMessage('clientEventHandler.onCooldown', undefined, [timeLeft.toFixed(1), command.name]));
    }
  }

  // Let the cooldown start for this user.
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Execute the command.
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(getMessage('clientEventHandler.errorExecutingCommand'));
  }
}
exports.handleOnMessage = handleOnMessage;