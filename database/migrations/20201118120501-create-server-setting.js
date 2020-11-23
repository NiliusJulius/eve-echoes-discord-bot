'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ServerSetting', {
      serverId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Server',
          key: 'serverId',
        },
      },
      settingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Setting',
          key: 'settingId',
        },
      },
      value: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ServerSetting');
  },
};