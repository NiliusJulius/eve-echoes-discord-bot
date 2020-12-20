const { getMessage } = require('../caches/languageCache');
const { prefix } = require('../config.json');

module.exports = {
  name: 'help',
  description: getMessage('helpCommand.description'),
  aliases: ['commands'],
  args: false,
  usage: getMessage('helpCommand.usage'),
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push(getMessage('helpCommand.listAllCommands'));
      data.push(commands.map(command => command.name).join(', '));
      data.push(getMessage('helpCommand.listAllCommands2', undefined, [prefix]));

      return message.author.send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply(getMessage('helpCommand.tellDMWithCommandsSent'));
        })
        .catch(error => {
          console.error(getMessage('helpCommand.dmFailureConsole', undefined, [message.author.tag]), error);
          message.reply(getMessage('helpCommand.dmFailure'));
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply(getMessage('helpCommands.notValidCommand'));
    }

    data.push(getMessage('helpCommand.commandName', undefined, [command.name]));

    if (command.description) data.push(getMessage('helpCommand.commandDescription', undefined, [command.description]));
    if (command.usage) data.push(getMessage('helpCommand.commandUsage', undefined, [prefix, command.name, command.usage]));
    if (command.aliases) data.push(getMessage('helpCommand.commandAliases', undefined, [command.aliases.join(', ')]));

    data.push(getMessage('helpCommand.commandCooldown', undefined, [command.cooldown || 3]));

    message.channel.send(data, { split: true });
  },
};