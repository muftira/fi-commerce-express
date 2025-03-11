'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResetLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ResetLink.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  ResetLink.init(
    {
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
      used: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'ResetLink',
    }
  );
  return ResetLink;
};
