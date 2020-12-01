'use strict';

const { setting } = require('../../helpers/constants');

const date = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Setting',
      [
        {
          settingId: setting.PREFIX,
          name: 'prefix',
          createdAt: date,
          updatedAt: date,
        },
        {
          settingId: setting.ROLE,
          name: 'Role',
          createdAt: date,
          updatedAt: date,
        },
      ],
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Setting');
  },
};
