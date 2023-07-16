'use strict';


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
   await queryInterface.bulkInsert("Attendances", [{
    userId: 5,
    clockIn: "08:39",
    clockOut: "16:56",
    date: new Date("2023-07-06"),
    status: "Present"
   }, {
    userId: 5,
    clockIn: "08:39",
    clockOut: "",
    date: new Date("2023-07-06"),
    status: "Half Day Salary Cut"
   }, {
    userId: 5,
    clockIn: "08:40",
    clockOut: "16:59",
    date: new Date("2023-07-06"),
    status: "Present"
   }, {
    userId: 5,
    clockIn: "",
    clockOut: "",
    date: new Date("2023-07-06"),
    status: "Full Day Salary Cut"
   }, {
    userId: 8,
    clockIn: "08:41",
    clockOut: "17:00",
    date: new Date("2023-07-06"),
    status: "Present"
   }, {
    userId: 5,
    clockIn: "08:57",
    clockOut: "",
    date: new Date("2023-07-06"),
    status: "Half Day Salary Cut"
   },{
    userId: 8,
    clockIn: "08:53",
    clockOut: "16:44",
    date: new Date("2023-07-06"),
    status: "Present"
   },{
    userId: 5,
    clockIn: "",
    clockOut: "",
    date: new Date("2023-07-06"),
    status: "Full Day Salary Cut"
   }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Attendances", null, {})
  }
};
