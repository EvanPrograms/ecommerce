const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../config/db')

class Cart extends Model {}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'cart'
})

module.exports = Cart