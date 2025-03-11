'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImageItem.belongsTo(models.Item, { foreignKey: 'itemId' });
    }
  }
  ImageItem.init(
    {
      itemId: DataTypes.INTEGER,
      cloudinaryId: DataTypes.STRING,
      url: DataTypes.STRING,
      statusDeleted: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ImageItem',
    }
  );
  return ImageItem;
};
