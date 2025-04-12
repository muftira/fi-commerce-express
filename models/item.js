'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Item.belongsTo(models.User, { foreignKey: 'userId' });
      Item.belongsTo(models.Category, { foreignKey: 'categoryId' });

      //super many to many
      Item.belongsToMany(models.Cart, {
        through: models.Cart_item,
        foreignKey: 'itemId',
      });
      Item.hasMany(models.Cart_item, {
        as: 'ItemsProduct',
        foreignKey: 'itemId',
      });
      Item.hasMany(models.ImageItem, { foreignKey: 'itemId' });
      Item.hasMany(models.Option, { foreignKey: 'itemId' });
      Item.hasMany(models.Variant, { foreignKey: 'itemId' });
    }
  }
  Item.init(
    {
      userId: DataTypes.INTEGER,
      productName: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      status: DataTypes.ENUM('active', 'inactive'),
      description: DataTypes.STRING,
      itemCode: DataTypes.STRING,
      numOrders: DataTypes.INTEGER,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Item',
    }
  );
  return Item;
};
