'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Option.hasMany(models.Value, { foreignKey: 'optionId' });
      Option.belongsTo(models.Item, { foreignKey: 'itemId' });
    }
  }
  Option.init(
    {
      name: DataTypes.STRING,
      itemId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Option',
      tableName: 'options',
    }
  );
  return Option;
};
