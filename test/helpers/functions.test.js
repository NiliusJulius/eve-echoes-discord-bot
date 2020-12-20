const Discord = require('discord.js');
const { getUserFromMention } = require('../../src/helpers/functions');

jest.mock('discord.js', () => ({
  Client: {
    users: {
      cache: new Map(),
    },
  },
}));

describe('Test getting users from mentions', () => {

  let client;

  beforeEach(() => {
    client = Discord.Client;
  });

  test('should return undefined when it is not a user mention', () => {
    expect(getUserFromMention('test', client)).toBeUndefined();
  });

  test('should return undefined when the mentioned user cannot be found', () => {
    expect(getUserFromMention('<@1234567890>', client)).toBeUndefined();
  });

  test('should return defined when it is a user mention', () => {
    client.users.cache.set('1234567890', {});
    expect(getUserFromMention('<@1234567890>', client)).toBeDefined();
  });

});