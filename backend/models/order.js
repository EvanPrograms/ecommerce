const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  items: {
    type: DataTypes.JSON, 
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.JSON, 
    allowNull: true,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'order',
});

module.exports = Order;
