const Discord = require('discord.js');
const { getMessage } = require('../../src/caches/languageCache');
const { execute } = require('../../src/commands/help');

describe('Test help execution', () => {

  let message;
  const testCommand1 = {
    name: 'test1name',
    description: 'testDescription1',
    usage: 'testUsage1',
    aliases: ['testAlias1'],
    cooldown: 5,
  };
  const testCommand2 = {
    name: 'test2name',
  };

  beforeEach(() => {
    message = {
      client: {
        commands: new Discord.Collection(),
      },
      author: {
        send: jest.fn(() => Promise.resolve({ data: {} })),
        tag: 'testTag',
      },
      channel: {
        type: 'dm',
        send: jest.fn(),
      },
      reply: jest.fn(),
    };

    message.client.commands.set(testCommand1.name, testCommand1);
    message.client.commands.set(testCommand2.name, testCommand2);
  });

  describe('Test without argument', () => {

    test('should DM a list of commands', async () => {
      await execute(message, []);
      expect(message.author.send).toHaveBeenCalled();
      expect(message.reply).not.toHaveBeenCalled();
    });

    test('should DM a list of commands and say that in chat', async () => {
      message.channel.type = 'text',
      await execute(message, []);
      expect(message.author.send).toHaveBeenCalled();
      expect(message.reply).toHaveBeenCalledWith(getMessage('helpCommand.tellDMWithCommandsSent'));
    });

    test('should send an error in chat if DM failed', async () => {
      const consoleBackup = console.error;
      console.error = jest.fn();

      message.channel.type = 'text',
      message.author.send = jest.fn(() => Promise.reject(new Error('oops')));
      await execute(message, []);
      expect(message.author.send).toHaveBeenCalled();
      expect(message.reply).not.toHaveBeenCalledWith(getMessage('helpCommand.tellDMWithCommandsSent'));
      expect(message.reply).toHaveBeenCalledWith(getMessage('helpCommand.dmFailure'));
      expect(console.error).toHaveBeenCalled();

      console.error = consoleBackup;
    });

    describe('Test with argument', () => {

      test('should reply that the command does not exist', async () => {
        await execute(message, ['notexistingcommand']);
        expect(message.reply).toHaveBeenCalledWith(getMessage('helpCommands.notValidCommand'));
      });

      test('should reply with command help for command with extra info', async () => {
        await execute(message, [testCommand1.name]);
        expect(message.channel.send).toHaveBeenCalled();
      });

      test('should reply with command help for command without extra info', async () => {
        await execute(message, [testCommand2.name]);
        expect(message.channel.send).toHaveBeenCalled();
      });

    });

  });

});