'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServerSetting extends Model {}
  ServerSetting.init({
    serverId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Server',
        key: 'serverId',
      },
    },
    settingId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Setting',
        key: 'settingId',
      },
    },
    value: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
  });
  return ServerSetting;
};