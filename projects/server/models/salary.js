'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Salary.belongsTo(models.User, {
        foreignKey: "userId"
      })
    }
  }
  Salary.init({
    userId: DataTypes.INTEGER,
    salary: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Salary',
  });
  return Salary;
};