require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: false,
    define: {
      freezeTableName: true,
    },
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: false,
    define: {
      freezeTableName: true,
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      freezeTableName: true,
    },
  },
};