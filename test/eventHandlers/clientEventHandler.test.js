const Discord = require('discord.js');
const { handleOnceReady, handleOnMessage } = require('../../src/eventHandlers/clientEventHandler');
const { botName } = require('../../src/config.json');
const { getMessage } = require('../../src/caches/languageCache');

describe('Test client events', () => {

  let client;

  beforeEach(() => {
    client = new Discord.Client();
  });

  test('should log that the bot is online', () => {
    const previousConsoleLog = console.log;
    console.log = jest.fn();

    handleOnceReady();
    expect(console.log).toHaveBeenCalledWith(`${botName} is online!`);
    console.log = previousConsoleLog;
  });

  describe('Handle messages', () => {

    let message;
    let testCommand;
    let cooldowns;

    beforeEach(() => {
      message = new Discord.Message();
      message.content = '!testcommand';
      message.author = {
        bot: false,
      };
      message.channel = {
        type: 'text',
      };
      message.reply = jest.fn();

      client.commands = new Discord.Collection();
      testCommand = {
        name: 'testcommand',
        description: 'Test description.',
        aliases: ['testAlias'],
        args: false,
        usage: '',
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
      expect(message.reply).toHaveBeenCalledWith(getMessage('cannotExecuteInDMs'));
    });

  });

  afterEach(() => {
    client.destroy();
  });
});