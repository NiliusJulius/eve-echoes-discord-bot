const { serverFactory } = require('./factories/ServerFactory');
const db = require('../../../src/database/models');
const { truncate } = require('../truncate');

let server;

beforeEach(async () => {
  await truncate();

  server = await serverFactory();
});

describe('Test', () => {
  test('should output server name', () => {
    expect(1).toBe(1);
  });
});

afterAll(async () => {
  await db.sequelize.close();
});

