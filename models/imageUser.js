'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImageUser.belongsTo(models.User, {foreignKey: "userId"})
    }
  }
  ImageUser.init({
    userId: DataTypes.INTEGER,
    cloudinaryId: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ImageUser',
  });
  return ImageUser;
};