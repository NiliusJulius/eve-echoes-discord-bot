const { getMessage } = require('../caches/languageCache');

module.exports = {
  name: 'reload',
  description: getMessage('reloadCommand.description'),
  args: true,
  argsLength: 1,
  usage: getMessage('reloadCommand.usage'),
  /* istanbul ignore next */
  execute(message, args) {
    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName)
      || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.channel.send(getMessage('reloadCommand.notFound', undefined, [commandName, message.author]));

    delete require.cache[require.resolve(`./${command.name}.js`)];

    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(getMessage('reloadCommand.reloaded', undefined, [command.name]));
    } catch (error) {
      console.error(error);
      message.channel.send(getMessage('reloadCommand.errorReloading', undefined, [command.name, error.message]));
    }
  },
};