const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../config/db')

class CheckoutSession extends Model {}

CheckoutSession.init({
  randomValue: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize, modelName: 'CheckoutSession'});

module.exports = CheckoutSession;
