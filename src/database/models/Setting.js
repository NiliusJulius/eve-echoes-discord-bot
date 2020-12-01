'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {

    static associate(models) {
      this.belongsToMany(models.Server, { through: models.ServerSetting, foreignKey: 'settingId' });
    }
  }
  Setting.init({
    settingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
  });
  return Setting;
};