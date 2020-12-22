const Discord = require('discord.js');
const { handleOnceReady, handleOnMessage } = require('../../src/eventHandlers/clientEventHandler');
const { botName, prefix } = require('../../src/config.json');
const { cooldown: defaultCooldown } = require('../../src/helpers/constants');
const { getMessage } = require('../../src/caches/languageCache');

describe('Test client events', () => {

  test('should log that the bot is online', () => {
    const previousConsoleLog = console.log;
    console.log = jest.fn();

    handleOnceReady();
    expect(console.log).toHaveBeenCalledWith(`${botName} is online!`);
    console.log = previousConsoleLog;
  });

  describe('Handle messages', () => {

    let client;
    let message;
    let testCommand;
    let cooldowns;

    beforeEach(() => {

      jest.useFakeTimers();

      client = {};

      message = new Discord.Message();
      message.content = '!testcommand';
      message.author = {
        bot: false,
        id: 'testId',
      };
      message.channel = {
        type: 'text',
        send: jest.fn(),
      };
      message.reply = jest.fn();

      client.commands = new Discord.Collection();
      testCommand = {
        name: 'testcommand',
        description: 'Test description.',
        aliases: ['testAlias'],
        args: false,
        usage: 'testUsage',
        cooldown: 5,
        guildOnly: false,
        execute: jest.fn(),
      };
      client.commands.set(testCommand.name, testCommand);

      cooldowns = new Discord.Collection();
    });

    test('should do nothing without prefix', () => {
      message.content = 'noPrefix';

      const result = handleOnMessage(message, client, cooldowns);
      expect(result).toBeUndefined();
    });

    test('should do nothing for messages from bots', () => {
      message.author.bot = true;

      const result = handleOnMessage(message, client, cooldowns);
      expect(result).toBeUndefined();
    });

    test('should do nothing for an unknown command', () => {
      message.content = '!unknownCommand';

      const result = handleOnMessage(message, client, cooldowns);
      expect(result).toBeUndefined();
    });

    test('should run execute for the chosen command', () => {
      const result = handleOnMessage(message, client, cooldowns);

      expect(client.commands.get(testCommand.name).execute).toHaveBeenCalled();
      expect(cooldowns.get(testCommand.name).get(message.author.id)).toBeDefined();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    test('should run execute for the chosen guildOnly command', () => {
      testCommand.guildOnly = true;

      const result = handleOnMessage(message, client, cooldowns);
      expect(client.commands.get(testCommand.name).execute).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    test('should reply error for the chosen guildOnly command in dm', () => {
      testCommand.guildOnly = true;
      message.channel.type = 'dm';

      handleOnMessage(message, client, cooldowns);
      expect(message.reply).toHaveBeenCalledWith(getMessage('clientEventHandler.cannotExecuteInDMs'));
    });

    test('should reply no arguments were given when required, includes usage', () => {
      testCommand.args = true;
      handleOnMessage(message, client, cooldowns);
      expect(message.channel.send).toHaveBeenCalledWith(getMessage('clientEventHandler.incorrectArguments', undefined, [message.author])
        + getMessage('clientEventHandler.properUsage', undefined, [prefix, testCommand.name, testCommand.usage]));
    });

    test('should reply no arguments were given when required, without usage', () => {
      testCommand.args = true;
      testCommand.usage = undefined;
      handleOnMessage(message, client, cooldowns);
      expect(message.channel.send).toHaveBeenCalledWith(getMessage('clientEventHandler.incorrectArguments', undefined, [message.author]));
    });

    test('should reply incorrect argument length given', () => {
      testCommand.args = true;
      testCommand.argsLength = 2;
      message.content = message.content + ' arg1';
      handleOnMessage(message, client, cooldowns);
      expect(message.channel.send).toHaveBeenCalledWith(getMessage('clientEventHandler.incorrectArguments', undefined, [message.author])
        + getMessage('clientEventHandler.properUsage', undefined, [prefix, testCommand.name, testCommand.usage]));
    });

    test('should run execute after cooldown is over', () => {
      const cooldown = new Discord.Collection();
      cooldown.set(message.author.id, 0);
      cooldowns.set(testCommand.name, cooldown);
      handleOnMessage(message, client, cooldowns);

      expect(client.commands.get(testCommand.name).execute).toHaveBeenCalled();
    });

    test('should send on cooldown message', () => {
      testCommand.cooldown = undefined;
      const cooldown = new Discord.Collection();
      cooldown.set(message.author.id, Date.now());
      cooldowns.set(testCommand.name, cooldown);
      handleOnMessage(message, client, cooldowns);

      expect(message.reply).toHaveBeenCalledWith(getMessage('clientEventHandler.onCooldown', undefined, [defaultCooldown.toFixed(1), testCommand.name]));
    });

    test('should remove from cooldown list after cooldown timer', () => {
      handleOnMessage(message, client, cooldowns);

      jest.advanceTimersByTime(testCommand.cooldown * 1000);

      expect(cooldowns.get(testCommand.name).get(message.author.id)).toBeUndefined();
    });

    test('should send error message if execution failed', () => {
      testCommand.execute = () => { throw new Error('oops'); };
      handleOnMessage(message, client, cooldowns);

      expect(message.reply).toHaveBeenCalledWith(getMessage('clientEventHandler.errorExecutingCommand'));
    });

  });

});