'use strict';

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Server',
      [
        {
          serverId: 1,
          name: 'Fun server',
          createdAt,
          updatedAt,
        },
        {
          serverId: 2,
          name: 'best server yo',
          createdAt,
          updatedAt,
        },
      ],
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Server');
  },
};
