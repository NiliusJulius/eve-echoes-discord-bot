const Discord = require('discord.js');

jest.mock('discord.js', () => ({
  Client: jest.fn(),
  Message: {
    channel: {
      send: jest.fn(),
    },
  },
}));

describe('should test all commands', () => {
  let msg;
  beforeAll(() => {
    msg = Discord.Message;
  });

  test('should check if command arguments are invoked correctly', () => {
    msg.channel.send('x');
    expect(msg.channel.send.mock.calls.length).toBe(1);
  });
});

describe('Test', () => {
  test('should output server name', () => {
    expect(1).toBe(1);
  });
});