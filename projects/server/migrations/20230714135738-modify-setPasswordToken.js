'use strict';

const { query } = require('express');
const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("Users", "setPasswordToken", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("Users", "setPasswordToken", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
  }
};
