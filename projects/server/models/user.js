'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleId"
      }),
      User.hasOne(models.Salary, {
        foreignKey: "userId"
      }),
      User.hasMany(models.Attendance, {
        foreignKey: "userId"
      })
    }
  }
  User.init({
    roleId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    setPasswordToken: DataTypes.STRING,
    fullName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    joinDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};