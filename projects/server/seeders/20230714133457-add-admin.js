'use strict';
const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const password = "1234-Jannik"
   const salt = await bcrypt.genSalt(10)
   const hashPass = await bcrypt.hash(password, salt)
   await queryInterface.bulkInsert("Users", [{
    roleId: 1,
    email: "admin@gmail.com",
    password: hashPass,
    fullName: "Andi Putra",
    dateOfBirth: new Date("1997-05-01"),
    joinDate: new Date("2020-09-04")
   }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  }
};
