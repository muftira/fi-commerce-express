'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.hasOne(models.Order, { foreignKey: 'cartId' });

      // super many to many
      Cart.belongsToMany(models.Item, {
        through: models.Cart_item,
        foreignKey: 'cartId',
      });
      Cart.hasMany(models.Cart_item, {
        as: 'ItemsProduct',
        foreignKey: 'cartId',
      });
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
      quantityTotal: DataTypes.INTEGER,
      totalPrice: DataTypes.DOUBLE,
      statusCart: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );
  return Cart;
};
