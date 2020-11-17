const Discord = require('discord.js');
const { botName, prefix, token } = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// Read all command files.
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Bot startup.
client.once('ready', () => {
  console.log(`${botName} is online!`);
});

// New member joining
client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'new-members');
  channel.send(`Welcome to the server, ${member}!`);
});

// Listen for commands.
client.on('message', message => {
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
    return message.reply('I can\'t execute that command inside DMs!');
  }

  // If the command requires arguments but did not receive any, or did not reive the correct amount of arguments.
  if (command.args && (!args.length || (command.argsLength && args.length != command.argsLength))) {
    let reply = `You didn't provide the correct argument(s), ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Grab the command cooldown information.
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  // If there is a cooldown on this command from the person trying to call it, return a message.
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
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
    message.reply('There was an error trying to execute that command.');
  }
});

client.login(token);