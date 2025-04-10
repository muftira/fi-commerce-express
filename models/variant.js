'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Variant.belongsTo(models.Item, { foreignKey: 'itemId' });
    }
  }
  Variant.init(
    {
      quantity: DataTypes.INTEGER,
      option1: DataTypes.STRING,
      option2: DataTypes.STRING,
      price: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      weight: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      compareAtPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Variant',
      tableName: 'variants',
    }
  );
  return Variant;
};
