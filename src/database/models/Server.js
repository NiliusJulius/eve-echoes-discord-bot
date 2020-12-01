'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Server extends Model {

    static associate(models) {
      this.belongsToMany(models.Setting, { through: models.ServerSetting, foreignKey: 'serverId' });
    }
  }
  Server.init({
    serverId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    freezeTableName: true,
  });
  return Server;
};