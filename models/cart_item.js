'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Cart_item.belongsTo(models.Item, { foreignKey: 'itemId' });
      Cart_item.belongsTo(models.Cart, { foreignKey: 'cartId' });
    }
  }
  Cart_item.init(
    {
      itemId: DataTypes.INTEGER,
      cartId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Cart_item',
    }
  );
  return Cart_item;
};
