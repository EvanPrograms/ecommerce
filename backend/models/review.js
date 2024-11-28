const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../config/db')

class Review extends Model {}

Review.init({
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
  review: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  stars: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'review',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id']
    }
  ]
})

module.exports = Review