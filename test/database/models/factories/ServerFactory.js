const faker = require('faker');
const db = require('../../../../src/database/models');

const data = async (props = {}) => {
  const defaultProps = {
    serverId: faker.random.number(),
    name: faker.name.firstName(),
  };
  return { ...defaultProps, ...props };
};

async function serverFactory(props = {}) {
  return db.Server.create(await data(props));
}

exports.serverFactory = serverFactory;