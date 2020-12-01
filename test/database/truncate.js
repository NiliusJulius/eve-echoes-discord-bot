const map = require('lodash/map');
const db = require('../../src/database/models');

async function truncate() {
  return await Promise.all(
    map(Object.keys(db), (key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return db[key].destroy({ where: {}, force: true });
    }),
  );
}
exports.truncate = truncate;