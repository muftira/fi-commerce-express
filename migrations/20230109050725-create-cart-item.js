'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cart_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemId: {
        type:Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: "Items",
          key: "id",
          as: "itemId"
        }
      },
      cartId: {
        type:Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: "Carts",
          key: "id",
          as: "cartId"
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cart_items');
  }
};