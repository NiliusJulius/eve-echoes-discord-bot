const Discord = require('discord.js');
const { execute } = require('../../src/commands/reload');
const { getMessage } = require('../../src/caches/languageCache');

describe('Test reload execution', () => {

  test('should throw when calling without argument', () => {
    expect(() => execute('', [])).toThrow();
  });

  test('should send error message when trying to reload unknown command', () => {
    const client = {
      commands: new Discord.Collection(),
    };
    const channel = {
      send: jest.fn(),
    };
    const message = new Discord.Message(client, undefined, channel);
    message.author = 'testAuthor';
    const command = 'test';
    execute(message, [command]);
    expect(channel.send).toHaveBeenCalledWith(getMessage('reloadCommand.notFound', undefined, [command, message.author]));
  });
});