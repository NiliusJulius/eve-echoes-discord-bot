'use strict';

const { setting } = require('../../../helpers/constants');

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'ServerSetting',
      [
        {
          serverId: 1,
          settingId: setting.PREFIX,
          value: '!',
          createdAt,
          updatedAt,
        },
        {
          serverId: 1,
          settingId: setting.ROLE,
          value: 'Testttt',
          createdAt,
          updatedAt,
        },
        {
          serverId: 2,
          settingId: setting.PREFIX,
          value: ',',
          createdAt,
          updatedAt,
        },
        {
          serverId: 2,
          settingId: setting.ROLE,
          value: 'Testttt2',
          createdAt,
          updatedAt,
        },
      ],
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ServerSetting');
  },
};
