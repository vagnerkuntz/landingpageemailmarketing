'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('accountEmails', {
      type: 'FOREIGN KEY',
      fields: ['accountId'],
      name: 'FK_accountEmail_account',
      references: {
        table: 'accounts',
        field: 'id'
      },
      onDelete: 'no action',
      onUpdate: 'no action'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('accountEmails', 'FK_accountEmail_account')
  }
};
