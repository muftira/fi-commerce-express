'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          fullName: 'Muhammad Mufti Ramadhan',
          email: 'muh.muftir@gmail.com',
          password: '$2y$10$R5tuqdSKYxkeitxoXPBQyeIbgyUARrqVQYmUH8/Q/LVSKJXZOYre2',
          address: 'Jalan Cilengkrang 1',
          phone: '081234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: 'Alin Amalina',
          email: 'alin.alna@gmail.com',
          password: '$2y$10$c1YgwQ1Sc/BF8mruTdGl0udz0O8eUum/LcCEFb8777ws04CHP954O',
          address: 'Jalan cimuncang 1',
          phone: '082345678901',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
